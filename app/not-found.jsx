import Link from 'next/link';

function OrangeBlossomDivider() {
  return (
    <div className="flex items-center justify-center gap-3 max-w-xs mx-auto" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A574]" />
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#B5704A]" fill="none">
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4"
            fill="none" stroke="currentColor" strokeWidth="1"
            transform={`rotate(${deg} 12 12)`} />
        ))}
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A574]" />
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FBF6F0] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

      <div className="text-center relative max-w-md">
        {/* Big 404 */}
        <p
          className="text-[10rem] leading-none text-[#E8D9C5] font-light tracking-tighter select-none mb-2"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          404
        </p>

        <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-4">
          Page introuvable
        </p>

        <h1
          className="text-3xl md:text-4xl text-[#1C1410] tracking-tight mb-5"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Cette page s'est évaporée
        </h1>

        <div className="mb-6">
          <OrangeBlossomDivider />
        </div>

        <p className="text-[#1C1410]/55 text-sm leading-relaxed mb-10">
          La page que vous cherchez n'existe plus ou a été déplacée. Revenez à notre boutique pour découvrir nos soins.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#1C1410] text-[#FBF6F0] px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors duration-300 inline-flex items-center gap-2 justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
            Retour à la boutique
          </Link>
          <Link
            href="/about"
            className="bg-white border border-[#E8D9C5] text-[#1C1410] px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:border-[#B5704A] hover:text-[#B5704A] transition-colors duration-300"
          >
            À propos
          </Link>
        </div>
      </div>
    </main>
  );
}