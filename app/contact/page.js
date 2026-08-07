'use client';
import { useState } from 'react';

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

function OrangeBlossomDivider() {
  return (
    <div className="flex items-center justify-center gap-3 max-w-xs mx-auto" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A574]" />
      <OrangeBlossomMark className="w-4 h-4 text-[#B5704A]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A574]" />
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `*Nouveau message - Site Web*\n\n*Nom:* ${formData.name}\n*Email:* ${formData.email}\n\n*Message:*\n${formData.message}`;
    window.open(`https://wa.me/212723908603?text=${encodeURIComponent(message)}`, '_blank');
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-[#FBF6F0] py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

      <div className="max-w-4xl mx-auto relative">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
            Nous contacter
          </p>
          <h1
            className="text-4xl md:text-5xl text-[#1C1410] tracking-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            Parlons-en
          </h1>
          <div className="max-w-xs mx-auto mb-4">
            <OrangeBlossomDivider />
          </div>
          <p className="text-[#1C1410]/60 text-sm max-w-md mx-auto">
            Une question, une envie particulière ? Notre équipe vous répond avec plaisir.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-10">

          {/* Contact info cards */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="https://wa.me/212723908603"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/80 backdrop-blur-sm p-6 rounded-[24px] border border-[#E8D9C5] shadow-[0_8px_30px_-12px_rgba(28,20,16,0.1)] hover:border-[#B5704A] transition-colors group"
            >
              <OrangeBlossomMark className="w-6 h-6 text-[#D4A574] mb-3" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5704A] font-semibold mb-1">
                WhatsApp
              </p>
              <p className="text-[#1C1410] font-medium group-hover:text-[#B5704A] transition-colors">
                +212 7 23 90 86 03
              </p>
              <p className="text-[#7A4B3A]/50 text-xs mt-1">Réponse rapide, 7j/7</p>
            </a>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[24px] border border-[#E8D9C5] shadow-[0_8px_30px_-12px_rgba(28,20,16,0.1)]">
              <OrangeBlossomMark className="w-6 h-6 text-[#D4A574] mb-3" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5704A] font-semibold mb-1">
                Email
              </p>
              <p className="text-[#1C1410] font-medium">contact@cosmetiques-amina.ma</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[24px] border border-[#E8D9C5] shadow-[0_8px_30px_-12px_rgba(28,20,16,0.1)]">
              <OrangeBlossomMark className="w-6 h-6 text-[#D4A574] mb-3" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5704A] font-semibold mb-1">
                Adresse
              </p>
              <p className="text-[#1C1410] font-medium">Casablanca, Maroc</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-7 bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[28px] shadow-[0_8px_40px_-12px_rgba(28,20,16,0.12)] border border-[#E8D9C5]"
          >
            <h2
              className="text-2xl text-[#1C1410] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Envoyez-nous un message
            </h2>

            {sent && (
              <div className="bg-[#B5704A]/10 border border-[#B5704A]/30 rounded-2xl p-4 mb-6 flex items-center gap-2">
                <OrangeBlossomMark className="w-4 h-4 text-[#B5704A]" />
                <p className="text-[#1C1410] text-sm">Redirection vers WhatsApp effectuée !</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-2 block">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full p-3.5 border-b-2 border-[#E8D9C5] bg-transparent text-[#1C1410] placeholder:text-[#1C1410]/25 focus:border-[#B5704A] outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full p-3.5 border-b-2 border-[#E8D9C5] bg-transparent text-[#1C1410] placeholder:text-[#1C1410]/25 focus:border-[#B5704A] outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-2 block">
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Votre message..."
                  className="w-full p-3.5 border-b-2 border-[#E8D9C5] bg-transparent text-[#1C1410] placeholder:text-[#1C1410]/25 focus:border-[#B5704A] outline-none transition-all duration-300 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full bg-[#1C1410] text-[#FBF6F0] py-5 rounded-full font-semibold uppercase tracking-[0.2em] text-sm hover:bg-[#B5704A] transition-colors duration-300 active:scale-[0.98] shadow-lg mt-8 flex items-center justify-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] group-hover:bg-[#FBF6F0] transition-colors" />
              Envoyer via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}