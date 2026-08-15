import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

    if (!projectId) {
      return NextResponse.json({ sanityProducts: [] });
    }

    // Saare products ke title aur name fetch kar rahe hain
    const query = encodeURIComponent(`*[_type in ["product", "cosmetics", "cosmetic"]]{ _id, title, name, category, "slug": slug.current }`);
    const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;

    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    return NextResponse.json({ sanityProducts: data.result || [] });
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return NextResponse.json({ sanityProducts: [] });
  }
}