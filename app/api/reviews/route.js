import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Write client — uses secret token, never exposed to browser
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // .env.local mein add karo
  useCdn: false,
});

export async function POST(request) {
  try {
    const { productId, customerName, city, rating, comment } = await request.json();

    // Basic validation
    if (!productId || !customerName?.trim() || !rating || !comment?.trim()) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Note invalide.' }, { status: 400 });
    }
    if (comment.length > 500) {
      return NextResponse.json({ error: 'Commentaire trop long.' }, { status: 400 });
    }

    // Create review in Sanity (approved: false — needs manual approval)
    await writeClient.create({
      _type: 'review',
      productId: { _type: 'reference', _ref: productId },
      customerName: customerName.trim().slice(0, 60),
      city: city?.trim().slice(0, 40) || '',
      rating: Number(rating),
      comment: comment.trim(),
      approved: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review submit error:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}