import ProductCard from './ProductCard'; // Apna naya premium card import kiya

export default function ProductGrid({ products }) {
  return (
    <section className="py-24">
      <h2 className="text-3xl font-bold text-cosmo-dark mb-12 tracking-tight">Sélection Amina</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products && products.length > 0 ? (
          products.map((p) => (
            /* Yahan hum apna naya component render kar rahe hain */
            <ProductCard key={p._id} product={p} lang="fr" />
          ))
        ) : (
          /* Agar Sanity se data nahi aaya toh ye message dikhega */
          <p className="text-cosmo-textgray col-span-4 text-center py-10">
            Chargement des produits de luxe... (Ou ajoutez-les dans Sanity)
          </p>
        )}
      </div>
    </section>
  );
}