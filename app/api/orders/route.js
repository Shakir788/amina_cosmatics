import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const customerName = formData.get('customerName');
    const phone = formData.get('phone');
    const city = formData.get('city') || '';
    const address = formData.get('address');
    const cartItemsRaw = formData.get('cartItems');
    const totalPrice = Number(formData.get('totalPrice'));
    const transactionId = formData.get('transactionId') || '';
    const screenshotFile = formData.get('screenshot');

    if (!customerName || !phone || !address || !cartItemsRaw || !totalPrice) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }
    if (!screenshotFile) {
      return NextResponse.json({ error: 'Capture d\'écran requise.' }, { status: 400 });
    }

    const cartItems = JSON.parse(cartItemsRaw);

    // Upload screenshot to Sanity assets
    const arrayBuffer = await screenshotFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await writeClient.assets.upload('image', buffer, {
      filename: screenshotFile.name || 'payment-screenshot.jpg',
      contentType: screenshotFile.type || 'image/jpeg',
    });

    // Generate order number
    const orderNumber = `AM-${Date.now().toString().slice(-6)}`;

    // Create order document
    const order = await writeClient.create({
      _type: 'order',
      orderNumber,
      customerName,
      phone,
      city,
      address,
      cartItems: cartItems.map((item) => ({
        _type: 'object',
        productName: item.name,
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || '',
      })),
      totalPrice,
      status: 'pending',
      orderDate: new Date().toISOString(),
      paymentMethod: 'online_qr',
      paymentStatus: 'pending_verification',
      transactionId,
      paymentScreenshot: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
    });

    return NextResponse.json({ success: true, orderNumber, orderId: order._id });
  } catch (error) {
    console.error('Order submit error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}