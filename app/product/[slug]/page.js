import Image from 'next/image';
import { client, urlFor } from '../../../sanity/client';
import Link from 'next/link';
import AddToCartBtn from '../../../components/AddToCartBtn';

export const revalidate = 0;

function OrangeBlossomMark({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.5"
          rx="2"
          ry="3.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

async function getProduct(slug) {
  const query = `*[_type == "cosmeticProduct" && slug.current == $slug][0]`;
  return await client.fetch(query, { slug });
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF6F0] text-center px-6">
        <OrangeBlossomMark className="w-8 h-8 text-[#D4A574] mb-5" />
        <h1
          className="text-3xl text-[#1C1410] mb-3"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Produit introuvable
        </h1>
        <p className="text-[#7A4B3A]/60 text-sm mb-8">
          Ce produit n'existe plus ou a été déplacé.
        </p>
        <Link
          href="/"
          className="bg-[#1C1410] text-[#FBF6F0] px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const currentPrice = Number(product.price);
  const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const isOutOfStock = product.inStock === false;
  const hasDiscount = oldPrice && oldPrice > currentPrice && !isOutOfStock;
  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#FBF6F0] py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/15 blur-3xl" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative">

        {/* Breadcrumb */}
        <div className="mb-10 text-[11px] font-semibold text-[#7A4B3A]/60 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-[#B5704A] transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-[#B5704A]">{product.category || "Soins"}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-16">

          {/* Left Side: Media Container */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-24 aspect-[4/5] w-full rounded-[28px] overflow-hidden bg-[#F0E4D4] shadow-[0_20px_60px_-15px_rgba(28,20,16,0.25)] ring-1 ring-[#E8D9C5] relative">
              <div className="relative w-full h-full">
                {product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover"
                  />
                ) : product.image ? (
                  <Image
                    src={urlFor(product.image).url()}
                    alt={product.name || "Product Image"}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>

              {hasDiscount && (
                <div className="absolute top-6 right-6 z-20 bg-[#B5704A] text-[#FBF6F0] text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                  <OrangeBlossomMark className="w-3 h-3 text-[#D4A574]" />
                  -{discountPercentage}%
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 z-30 bg-[#FBF6F0]/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-[#1C1410] text-[#D4A574] text-xs uppercase tracking-[0.25em] px-6 py-3 rounded-full font-semibold shadow-xl">
                    Épuisé
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B5704A] font-semibold mb-4">
              {product.category}
            </span>

            <h1
              className="text-4xl md:text-5xl text-[#1C1410] mb-6 leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <p
                className="text-3xl text-[#1C1410]"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                {currentPrice} <span className="text-base text-[#B5704A]">MAD</span>
              </p>
              {oldPrice && !isOutOfStock && (
                <p className="text-base text-[#7A4B3A]/45 line-through font-medium">
                  {oldPrice} MAD
                </p>
              )}
            </div>

            <p className="text-[#1C1410]/65 mb-10 leading-relaxed max-w-md">
              {product.description || "Une formule luxueuse conçue pour révéler votre beauté naturelle."}
            </p>

            <div className="max-w-xs">
              <AddToCartBtn product={product} />
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-[#E8D9C5] max-w-md">
              <div className="flex flex-col items-start gap-2">
                <OrangeBlossomMark className="w-5 h-5 text-[#D4A574]" />
                <p className="text-[11px] text-[#1C1410]/70 leading-tight">Livraison 24/48h</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <OrangeBlossomMark className="w-5 h-5 text-[#D4A574]" />
                <p className="text-[11px] text-[#1C1410]/70 leading-tight">100% Authentique</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <OrangeBlossomMark className="w-5 h-5 text-[#D4A574]" />
                <p className="text-[11px] text-[#1C1410]/70 leading-tight">Retour sous 7 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}