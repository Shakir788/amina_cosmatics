import ProductCard from './ProductCard';

function SkeletonCard() {
  return (
    <div className="bg-white/80 rounded-[28px] p-4 border border-[#E8D9C5] animate-pulse">
      <div className="aspect-[9/16] w-full bg-[#F0E4D4] rounded-[20px] mb-5" />
      <div className="px-2 space-y-2.5">
        <div className="h-2.5 bg-[#E8D9C5] rounded-full w-1/3" />
        <div className="h-5 bg-[#E8D9C5] rounded-full w-3/4" />
        <div className="h-3 bg-[#E8D9C5] rounded-full w-1/4 mt-3" />
      </div>
    </div>
  );
}

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

export default function ProductGrid({ products, isLoading = false }) {
  // Show 4 skeletons while loading
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <section className="py-8">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <OrangeBlossomMark className="w-8 h-8 text-[#D4A574] mb-4" />
          <p className="text-[#1C1410]/50 text-sm mb-2">Aucun produit disponible pour le moment.</p>
          <p className="text-[#7A4B3A]/40 text-xs">Ajoutez des produits depuis Sanity Studio.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} lang="fr" />
        ))}
      </div>
    </section>
  );
}