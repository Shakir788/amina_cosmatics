import { client } from '../../sanity/client';
import ProductCard from '../../components/ProductCard';
import CategoryGrid from '../../components/CategoryGrid'; // Advanced Filter Component
import { notFound } from 'next/navigation';

export const revalidate = 60; // Cache refresh every 1 minute for optimum performance

// Dynamic Category Mapping for Moroccan Market
const categoryMapping = {
  soins: { title: "Soins du Visage & Corps", queryFilter: "soins" },
  parfums: { title: "Haute Parfumerie", queryFilter: "parfums" },
  marques: { title: "Nos Marques Prestigious", queryFilter: "all" }
};

// 🌟 PRIORITY 3: ADVANCED DYNAMIC SEO METADATA
export async function generateMetadata({ params }) {
  const { category } = await params;
  const currentCategory = categoryMapping[category.toLowerCase()];

  if (!currentCategory) {
    return { title: 'Catégorie Introuvable | Cosmétiques Amina' };
  }

  return {
    title: `${currentCategory.title} | Cosmétiques Amina`,
    description: `Découvrez notre sélection exclusive de ${currentCategory.title} au Maroc. Produits 100% authentiques, livraison express 24/48h.`,
    openGraph: {
      title: `${currentCategory.title} | Cosmétiques Amina`,
      description: `Premium beauty marketplace in Casablanca.`,
      images: [{ url: '/og-banner.jpg' }],
    },
  };
}

// Data Fetching via Highly Optimized Sanity GROQ Query
async function getCategoryProducts(categorySlug) {
  const mapping = categoryMapping[categorySlug.toLowerCase()];
  if (!mapping) return null;

  // Advanced GROQ: Fetches only required fields, handles stock weights
  const query = mapping.queryFilter === "all"
    ? `*[_type == "cosmeticProduct"] | order(inStock desc, _createdAt desc) { _id, name, name_fr, slug, price, originalPrice, inStock, category, image, videoUrl }`
    : `*[_type == "cosmeticProduct" && (category match $filter || tags[] match $filter)] | order(inStock desc, _createdAt desc) { _id, name, name_fr, slug, price, originalPrice, inStock, category, image, videoUrl }`;

  return await client.fetch(query, { filter: mapping.queryFilter });
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const targetCategory = categoryMapping[category.toLowerCase()];

  if (!targetCategory) {
    notFound(); // Triggers your custom 404 page instantly
  }

  const products = await getCategoryProducts(category);

  return (
    <main className="min-h-screen bg-[#FBF6F0] py-12 relative overflow-hidden">
      {/* Background Architectural Blur */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[400px] bg-gradient-to-b from-[#D4A574]/10 to-transparent blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Header Section */}
        <header className="text-center max-w-3xl mx-auto mb-16 mt-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B5704A] font-bold block mb-3 animate-fade-in">
            Maison Amina Casablanca
          </span>
          <h1 
            className="text-4xl md:text-6xl text-[#1C1410] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            {targetCategory.title}
          </h1>
          <div className="w-12 h-[1px] bg-[#D4A574] mx-auto mt-6 mb-4" />
          <p className="text-sm text-[#1C1410]/60 uppercase tracking-[0.15em]">
            {products?.length || 0} Chef-d'œuvres trouvés
          </p>
        </header>

        {/* Advanced Interactive Interactive Grid */}
        <CategoryGrid initialProducts={products} />

      </div>
    </main>
  );
}