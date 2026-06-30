function OrangeBlossomDivider() {
  return (
    <div className="flex items-center justify-center gap-3 max-w-xs mx-auto" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A574]" />
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#B5704A]" fill="none">
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
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A574]" />
    </div>
  );
}

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

const values = [
  {
    title: 'Authenticité',
    desc: "Chaque produit est sourcé directement auprès de marques certifiées. Pas de copies, pas de compromis.",
  },
  {
    title: 'Curation',
    desc: "Nous ne vendons pas tout. Nous sélectionnons ce qui mérite vraiment de rejoindre votre rituel beauté.",
  },
  {
    title: 'Proximité',
    desc: "Une équipe basée au Maroc, joignable par WhatsApp, qui comprend vos besoins et votre quotidien.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#FBF6F0] min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 py-28 text-center">
        <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-4">
            Notre histoire
          </p>
          <h1
            className="text-5xl md:text-6xl text-[#1C1410] tracking-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            Une maison née d'une exigence simple
          </h1>
          <div className="mb-6">
            <OrangeBlossomDivider />
          </div>
          <p className="text-[#1C1410]/60 text-lg leading-relaxed">
            Offrir aux femmes marocaines un accès direct aux meilleures marques de cosmétiques mondiales, sans intermédiaire, sans compromis sur l'authenticité.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-6 md:px-12 -mt-4 mb-4">
        <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm border border-[#E8D9C5] rounded-[28px] py-10 px-8 grid grid-cols-3 divide-x divide-[#E8D9C5] shadow-[0_8px_30px_-12px_rgba(28,20,16,0.08)]">
          {[
            { value: '2024', label: 'Depuis' },
            { value: '30+', label: 'Marques sélectionnées' },
            { value: '500+', label: 'Clientes satisfaites' },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-3">
              <p
                className="text-3xl md:text-4xl text-[#1C1410] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#7A4B3A]/60 font-semibold leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-3xl text-[#1C1410] tracking-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Pourquoi Amina ?
            </h2>
            <p className="text-[#1C1410]/65 leading-relaxed mb-4">
              Cosmétiques Amina est née à Casablanca d'un constat simple : trouver des produits de beauté authentiques, sans se déplacer en boutique et sans tomber sur des copies, restait trop compliqué.
            </p>
            <p className="text-[#1C1410]/65 leading-relaxed">
              Nous avons construit une sélection pensée pour la femme marocaine moderne — exigeante, occupée, et qui mérite un rituel de beauté à la hauteur de ses attentes.
            </p>
          </div>
          <div className="aspect-square bg-[#F0E4D4] rounded-[28px] flex items-center justify-center border border-[#E8D9C5]">
            <OrangeBlossomMark className="w-16 h-16 text-[#D4A574]" />
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <div className="bg-white p-10 md:p-14 rounded-[32px] border border-[#E8D9C5] shadow-[0_8px_40px_-12px_rgba(28,20,16,0.1)] grid md:grid-cols-12 gap-10 items-center">

          {/* Photo placeholder — replace bg-image with real founder photo */}
          <div className="md:col-span-4">
            <div className="aspect-square rounded-[24px] bg-[#F0E4D4] border border-[#E8D9C5] flex items-center justify-center overflow-hidden relative">
              {/* 🔌 Replace this div with: <Image src="/founder.jpg" alt="Amina" fill className="object-cover" /> */}
              <OrangeBlossomMark className="w-12 h-12 text-[#D4A574]" />
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="text-[#B5704A] uppercase tracking-[0.3em] text-[10px] font-semibold mb-3">
              La fondatrice
            </p>
            <h2
              className="text-3xl text-[#1C1410] tracking-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Un mot d'Amina
            </h2>
            <p className="text-[#1C1410]/65 leading-relaxed mb-3">
              « J'ai lancé cette maison parce que je voulais, pour moi-même comme pour mes clientes, une seule adresse de confiance pour la beauté — sans douter de l'authenticité de chaque produit. »
            </p>
            <p className="text-[#7A4B3A]/60 text-sm">
              Amina — Fondatrice, Casablanca
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-12 py-20 bg-white/50 border-y border-[#E8D9C5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
              Nos engagements
            </p>
            <h2
              className="text-4xl text-[#1C1410] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Ce qui nous guide
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white p-8 rounded-[24px] border border-[#E8D9C5] shadow-[0_8px_30px_-12px_rgba(28,20,16,0.08)]"
              >
                <OrangeBlossomMark className="w-6 h-6 text-[#D4A574] mb-4" />
                <h3
                  className="text-xl text-[#1C1410] mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-[#1C1410]/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-24 text-center">
        <h2
          className="text-3xl md:text-4xl text-[#1C1410] tracking-tight mb-6"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Prête à découvrir votre éclat ?
        </h2>
        <a
          href="/"
          className="inline-flex items-center gap-3 bg-[#1C1410] text-[#FBF6F0] px-10 py-5 rounded-full font-semibold uppercase tracking-[0.2em] text-sm hover:bg-[#B5704A] transition-colors duration-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
          Découvrir la collection
        </a>
      </section>

    </main>
  );
}