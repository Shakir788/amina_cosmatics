'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { client, urlFor } from '../../sanity/client';
import Link from 'next/link';
import Image from 'next/image';

function OrangeBlossomMark({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4"
          fill="none" stroke="currentColor" strokeWidth="1"
          transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

// Skeleton card
function SkeletonCard() {
  return (
    <div className="bg-white/70 rounded-[24px] p-4 border border-[#E8D9C5] animate-pulse">
      <div className="aspect-[9/16] bg-[#F0E4D4] rounded-[18px] mb-4" />
      <div className="h-3 bg-[#E8D9C5] rounded-full w-1/3 mb-2" />
      <div className="h-4 bg-[#E8D9C5] rounded-full w-2/3" />
    </div>
  );
}

// Everything that touches useSearchParams lives here, inside the Suspense boundary.
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);

    const sanityQuery = `*[_type == "cosmeticProduct" && (
      name match $search ||
      name_fr match $search ||
      category match $search
    )] | order(_createdAt desc) [0...20] {
      _id, name, name_fr, slug, price, originalPrice, image, category, inStock
    }`;

    client.fetch(sanityQuery, { search: `*${query}*` })
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="min-h-screen bg-[#FBF6F0] py-28 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
            Résultats de recherche
          </p>
          <h1 className="text-4xl md:text-5xl text-[#1C1410] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            "{query}"
          </h1>
          {!loading && (
            <p className="text-[#7A4B3A]/60 text-sm mt-3">
              {results.length > 0
                ? `${results.length} produit${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`
                : 'Aucun produit trouvé'}
            </p>
          )}
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : results.map((product) => {
                const name = product.name_fr || product.name || 'Produit';
                const price = Number(product.price);
                const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
                const hasDiscount = oldPrice && oldPrice > price && product.inStock !== false;

                return (
                  <Link key={product._id} href={`/product/${product.slug?.current}`}
                    className="group bg-white/80 backdrop-blur-sm rounded-[24px] p-4 border border-[#E8D9C5] shadow-[0_4px_20px_-8px_rgba(28,20,16,0.1)] hover:shadow-[0_8px_30px_-8px_rgba(28,20,16,0.18)] transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-[9/16] bg-[#F0E4D4] rounded-[18px] mb-4 overflow-hidden relative">
                      {product.image && (
                        <Image src={urlFor(product.image).url()} alt={name}
                          fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw" />
                      )}
                      {hasDiscount && (
                        <span className="absolute top-3 right-3 bg-[#B5704A] text-[#FBF6F0] text-[10px] font-bold px-2.5 py-1 rounded-full">
                          -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] uppercase text-[#B5704A] tracking-[0.2em] font-semibold mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-[#1C1410] group-hover:text-[#B5704A] transition-colors line-clamp-1 text-base"
                      style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
                      {name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {hasDiscount && <span className="text-[#7A4B3A]/45 text-xs line-through">{oldPrice} MAD</span>}
                      <span className="text-[#1C1410] font-semibold text-sm">{price} <span className="text-[10px] text-[#B5704A]">MAD</span></span>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Empty state */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-20">
            <OrangeBlossomMark className="w-8 h-8 text-[#D4A574] mx-auto mb-4" />
            <p className="text-[#1C1410]/60 mb-6">Aucun produit ne correspond à votre recherche.</p>
            <Link href="/"
              className="bg-[#1C1410] text-[#FBF6F0] px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors">
              Voir tous les produits
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function SearchFallback() {
  return (
    <main className="min-h-screen bg-[#FBF6F0] py-28 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
            Résultats de recherche
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}