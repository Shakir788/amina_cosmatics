// app/contact/page.js
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FBF6F0] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A574] font-bold mb-4">
            Assistance
          </p>
          <h1 className="text-4xl md:text-5xl text-[#1C1410] mb-4 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Contactez-Nous
          </h1>
          <p className="text-[#7A4B3A]/60 max-w-md mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start mt-12">
          
          {/* Left Side: Contact Form */}
          <div className="bg-white/40 p-8 md:p-10 rounded-[24px] border border-[#E8D9C5] shadow-sm">
            <h3 className="text-2xl text-[#1C1410] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Envoyez-nous un message
            </h3>
            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#1C1410]/70 mb-2 font-semibold">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-[#1C1410]/20 pb-3 text-sm focus:outline-none focus:border-[#B5704A] transition-colors" 
                  placeholder="Votre nom" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#1C1410]/70 mb-2 font-semibold">Adresse e-mail</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-[#1C1410]/20 pb-3 text-sm focus:outline-none focus:border-[#B5704A] transition-colors" 
                  placeholder="votre@email.com" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#1C1410]/70 mb-2 font-semibold">Message</label>
                <textarea 
                  rows="4" 
                  className="w-full bg-transparent border-b border-[#1C1410]/20 pb-3 text-sm focus:outline-none focus:border-[#B5704A] transition-colors resize-none" 
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>
              <button 
                type="button" 
                className="bg-[#1C1410] text-[#FBF6F0] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors w-full mt-4"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Right Side: Contact Info */}
          <div className="flex flex-col justify-center space-y-10 h-full">
            <div>
              <h3 className="text-2xl text-[#1C1410] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Informations Directes
              </h3>
              <p className="text-[#7A4B3A]/70 text-sm leading-relaxed mb-8">
                Vous préférez nous parler directement ? N'hésitez pas à nous contacter via WhatsApp ou par e-mail. Nous répondons généralement dans les 24 heures.
              </p>
              
              <div className="space-y-6">
                <a href="https://wa.me/212723908603" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-[#D4A574]/40 flex items-center justify-center group-hover:border-[#B5704A] group-hover:bg-[#B5704A] group-hover:text-white transition-all text-[#B5704A]">
                    <FaWhatsapp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#1C1410]/50 font-bold mb-1">WhatsApp</p>
                    <p className="text-[#1C1410] font-medium">+212 723-908603</p>
                  </div>
                </a>

                <a href="mailto:aminaclothingbrand@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-[#D4A574]/40 flex items-center justify-center group-hover:border-[#B5704A] group-hover:bg-[#B5704A] group-hover:text-white transition-all text-[#B5704A]">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#1C1410]/50 font-bold mb-1">E-mail</p>
                    <p className="text-[#1C1410] font-medium">aminaclothingbrand@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#D4A574]/40 flex items-center justify-center text-[#B5704A]">
                    <FaMapMarkerAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#1C1410]/50 font-bold mb-1">Emplacement</p>
                    <p className="text-[#1C1410] font-medium">Casablanca, Maroc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}