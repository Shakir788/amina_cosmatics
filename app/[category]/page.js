import { client } from '../../sanity/client';
import CategoryGrid from '../../components/CategoryGrid'; 
import { notFound } from 'next/navigation';

export const revalidate = 60; 

const categoryMapping = {
  soins: { title: "Soins du Visage & Corps", queryFilter: "soins" },
  parfums: { title: "Haute Parfumerie", queryFilter: "parfums" },
  marques: { title: "Nos Marques Prestigieuses", queryFilter: "all" } // Prestigieuses spelling fix
};

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

async function getCategoryProducts(categorySlug) {
  const mapping = categoryMapping[categorySlug.toLowerCase()];
  if (!mapping) return null;

  const query = mapping.queryFilter === "all"
    ? `*[_type == "cosmeticProduct"] | order(inStock desc, _createdAt desc) { _id, name, name_fr, slug, price, originalPrice, inStock, category, image, videoUrl }`
    : `*[_type == "cosmeticProduct" && (category match $filter || tags[] match $filter)] | order(inStock desc, _createdAt desc) { _id, name, name_fr, slug, price, originalPrice, inStock, category, image, videoUrl }`;

  return await client.fetch(query, { filter: mapping.queryFilter });
}

// Maison Amina Luxury Divider
function OrangeBlossomDivider() {
  return (
    <svg viewBox="0 0 240 24" className="w-full h-6 my-2" fill="none" aria-hidden="true">
      <line x1="0" y1="12" x2="95" y2="12" stroke="#D4A574" strokeWidth="1" />
      <line x1="145" y1="12" x2="240" y2="12" stroke="#D4A574" strokeWidth="1" />
      <g transform="translate(120,12)">
        <circle r="2.2" fill="#B5704A" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-6" rx="2.6" ry="4.2"
            fill="none" stroke="#B5704A" strokeWidth="0.9"
            transform={`rotate(${deg})`} />
        ))}
      </g>
    </svg>
  );
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const targetCategory = categoryMapping[category.toLowerCase()];

  if (!targetCategory) {
    notFound(); 
  }

  const products = await getCategoryProducts(category) || [];

  return (
    <main className="min-h-screen bg-[#FBF6F0] py-24 relative overflow-hidden">
      {/* Background Architectural Blur */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Header Section */}
        <header className="text-center max-w-3xl mx-auto mb-16 mt-6">
          <span className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3 block">
            Maison Amina Casablanca
          </span>
          <h1 
            className="text-4xl md:text-6xl text-[#1C1410] tracking-tight leading-[1.1] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            {targetCategory.title}
          </h1>
          
          <div className="max-w-xs mx-auto">
            <OrangeBlossomDivider />
          </div>
          
          <p className="text-[#7A4B3A]/80 text-sm tracking-widest uppercase mt-4 font-medium">
            {products.length} {products.length > 1 ? 'Produits' : 'Produit'}
          </p>
        </header>

        {/* Advanced Interactive Grid */}
        <CategoryGrid initialProducts={products} />

      </div>
    </main>
  );
}