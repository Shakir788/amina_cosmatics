function OrangeBlossomMark({ className = "w-6 h-6" }) {
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

export default function SoinsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#FBF6F0] text-center">
      <div className="max-w-md">
        <OrangeBlossomMark className="w-8 h-8 text-[#D4A574] mx-auto mb-6" />
        <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
          Bientôt disponible
        </p>
        <h1
          className="text-4xl md:text-5xl text-[#1C1410] tracking-tight mb-5"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Soins du Visage
        </h1>
        <p className="text-[#1C1410]/60 leading-relaxed">
          Notre gamme de soins du visage arrive très prochainement. Restez à l'écoute pour découvrir nos rituels de beauté.
        </p>
      </div>
    </main>
  );
}