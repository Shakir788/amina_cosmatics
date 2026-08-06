import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import ReelsSection from '../components/ReelsSection';
import SkinQuizBanner from '../components/SkinQuizBanner'; 
import { client } from '../sanity/client'; 

export const revalidate = 0;

function OrangeBlossomDivider() {
  return (
    <div className="flex items-center justify-center gap-3 max-w-xs mx-auto" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A574]" />
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#B5704A]" fill="none">
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${deg} 12 12)`} />
        ))}
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A574]" />
    </div>
  );
}

async function getCosmetics() {
  // ✨ UPDATE: Added "uploadedVideoUrl" so Reels can play the video!
  const query = `*[_type == "cosmeticProduct"] | order(_createdAt desc)[0...6] {
    _id,
    name,
    name_fr,
    slug,
    price,
    originalPrice,
    image,
    videoUrl,
    "uploadedVideoUrl": videoFile.asset->url,
    category,
    inStock
  }`;
  
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getCosmetics();

  return (
    <main className="flex flex-col bg-[#FBF6F0]">
      <HeroSection />

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto w-full">
        <section className="mt-8 mb-12">
          <div className="text-center mb-14">
            <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
              Sélection
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#1C1410] tracking-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Nos dernières arrivées
            </h2>
            <OrangeBlossomDivider />
          </div>
          <ProductGrid products={products} />
        </section>

        <section>
          <SkinQuizBanner />
        </section>

        <section className="mb-24 mt-12">
          <div className="text-center mb-14">
            <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
              En direct
            </p>
            <h2
              className="text-4xl md:text-5xl text-[#1C1410] tracking-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              L'éclat en mouvement
            </h2>
            <OrangeBlossomDivider />
          </div>

          {/* ✨ UPDATE: Ab ReelsSection ko bhi real Sanity products bhej rahe hain */}
          <ReelsSection products={products} />
        </section>
      </div>
    </main>
  );
}