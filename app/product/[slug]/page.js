import { client, urlFor } from '../../../sanity/client';
import ProductClient from '../../../components/ProductClient'; // 🌟 UI aur Translation wala naya component

export const revalidate = 0;

async function getProduct(slug) {
  const query = `*[_type == "cosmeticProduct" && slug.current == $slug][0]{
    ...,
    "galleryUrls": gallery[].asset->url,
    "uploadedVideoUrl": videoFile.asset->url
  }`;
  return await client.fetch(query, { slug });
}

export default async function ProductPage({ params }) {
  // Params ko resolve karna zaroori hai Next.js 15+ mein
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF6F0]">
        <h1 className="text-2xl text-[#1C1410] font-serif">Produit introuvable (Product Not Found)</h1>
      </div>
    );
  }

  // Media list banane ka logic (Video aur Images ko combine karne ke liye)
  const mediaList = [];
  const finalVideoUrl = product.videoUrl || product.uploadedVideoUrl;

  if (finalVideoUrl && typeof finalVideoUrl === 'string' && finalVideoUrl.trim() !== '') {
    mediaList.push({ id: 'video', type: 'video', url: finalVideoUrl });
  }
  
  if (product.image) {
    mediaList.push({ id: 'cover', type: 'image', url: urlFor(product.image).url() });
  }
  
  if (product.galleryUrls && Array.isArray(product.galleryUrls)) {
    product.galleryUrls.forEach((url, idx) => {
      if (url) mediaList.push({ id: `gallery-${idx}`, type: 'image', url });
    });
  }

  // 🌟 Sanity se data liya aur sidha ProductClient ko bhej diya render hone ke liye
  return <ProductClient product={product} mediaList={mediaList} />;
}