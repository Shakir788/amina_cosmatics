'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQ_DATA = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "Nous assurons une livraison rapide partout au Maroc en 24h à 48h ouvrables. Chaque commande est préparée avec le plus grand soin dans nos ateliers à Casablanca."
  },
  {
    q: "Livrez-vous en dehors des grandes villes ?",
    a: "Oui, nous livrons dans tout le Maroc, y compris les villes secondaires. Le délai peut être légèrement plus long (48h à 72h) pour certaines zones éloignées."
  },
  {
    q: "Quels sont les frais de livraison ?",
    a: "La livraison est gratuite dès 500 MAD d'achat. En dessous de ce montant, des frais fixes de 30 MAD s'appliquent, calculés automatiquement au moment du paiement."
  },
  {
    q: "Comment puis-je suivre ma commande ?",
    a: "Dès que votre commande est expédiée, vous recevrez un message WhatsApp ou un e-mail avec les détails de suivi pour suivre l'acheminement de votre colis en temps réel."
  },
  {
    q: "Quels sont les modes de paiement disponibles ?",
    a: "Nous proposons deux modes sécurisés : le paiement en ligne par carte (Visa/Mastercard) via notre plateforme sécurisée Cash Plus, ou le paiement à la livraison (COD) directement à votre domicile."
  },
  {
    q: "Puis-je modifier ou annuler ma commande après l'avoir passée ?",
    a: "Oui, tant que la commande n'est pas encore expédiée. Contactez-nous rapidement sur WhatsApp avec votre numéro de commande, et nous ferons le nécessaire."
  },
  {
    q: "Quelle est votre politique de retour ?",
    a: "La satisfaction de nos clientes est notre priorité. Si un produit ne correspond pas à vos attentes, vous avez 7 jours après réception pour nous contacter et effectuer un retour ou un échange, sous réserve que le produit soit intact et dans son emballage d'origine."
  },
  {
    q: "Que faire si mon produit arrive endommagé ?",
    a: "Contactez-nous dans les 48h suivant la réception avec une photo du produit et de l'emballage. Nous organisons un échange ou un remboursement sans frais supplémentaires."
  },
  {
    q: "Les produits sont-ils authentiques ?",
    a: "Absolument. Cosmétiques Amina travaille uniquement avec des marques certifiées et des distributeurs officiels. Nous garantissons l'authenticité de chaque produit présent sur notre boutique."
  },
  {
    q: "Comment savoir quel produit correspond à mon type de peau ?",
    a: "Utilisez notre quiz peau personnalisé, disponible sur la page d'accueil : en quelques questions, il analyse votre type de peau, votre sensibilité et vos priorités pour vous recommander une routine sur-mesure."
  },
  {
    q: "Dans quel ordre appliquer les produits d'une routine ?",
    a: "En général : nettoyant, puis sérum, puis crème. Le matin, terminez toujours par une protection solaire. Les actifs comme le rétinol s'appliquent uniquement le soir."
  },
  {
    q: "Les produits conviennent-ils aux peaux sensibles ?",
    a: "Plusieurs de nos gammes sont formulées pour les peaux sensibles : testées dermatologiquement et sans parfum irritant. Ces produits sont clairement indiqués sur leur fiche."
  },
  {
    q: "Proposez-vous des codes promo ou des réductions ?",
    a: "Oui, inscrivez-vous à notre newsletter ou suivez-nous sur Instagram pour recevoir nos offres exclusives et codes promo en avant-première."
  },
  {
    q: "Comment vous contacter en cas de question ?",
    a: "Notre équipe est disponible du lundi au samedi, de 9h à 19h, sur WhatsApp pour répondre à toutes vos questions avant ou après votre commande."
  }
];

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

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      className={`group relative bg-white rounded-[26px] border transition-all duration-300 ${
        isOpen
          ? 'border-[#B5704A]/40 shadow-[0_16px_40px_-12px_rgba(28,20,16,0.22)]'
          : 'border-[#E8D9C5] shadow-[0_4px_16px_-8px_rgba(28,20,16,0.08)] hover:shadow-[0_10px_28px_-10px_rgba(28,20,16,0.16)] hover:-translate-y-0.5'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 px-6 flex items-center justify-between text-left"
      >
        <span className={`pr-6 font-medium transition-colors ${isOpen ? 'text-[#B5704A]' : 'text-[#1C1410] group-hover:text-[#B5704A]'}`}>
          {item.q}
        </span>
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border border-[#E8D9C5] transition-all duration-300"
          style={{
            background: 'linear-gradient(145deg, #FBF6F0, #F0E4D4)',
            boxShadow: isOpen
              ? 'inset 0 2px 4px rgba(28,20,16,0.15)'
              : 'inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 6px -2px rgba(28,20,16,0.25)'
          }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#B5704A]"
          >
            <Plus className="w-4 h-4" />
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[#7A4B3A]/80 text-sm leading-relaxed pr-10">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="min-h-screen py-32 px-6 max-w-3xl mx-auto relative overflow-hidden">
      {/* Ambient background depth */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D4A574]/20 blur-[90px]" />
      <div className="pointer-events-none absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#B5704A]/10 blur-[100px]" />

      <div className="relative text-center mb-16">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6 text-[#B5704A]"
          style={{
            background: 'linear-gradient(145deg, #FBF6F0, #F0E4D4)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 8px 20px -8px rgba(28,20,16,0.25)'
          }}
        >
          <OrangeBlossomMark className="w-6 h-6" />
        </div>
        <p className="text-[#B5704A] uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Besoin d'aide ?</p>
        <h1 className="text-4xl md:text-5xl text-[#1C1410] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Foire aux questions
        </h1>
        <p className="text-[#7A4B3A]/70">Toutes les réponses à vos interrogations sur Cosmétiques Amina.</p>
      </div>

      <div className="relative space-y-3">
        {FAQ_DATA.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      <div className="relative mt-12 text-center">
        <p className="text-[#7A4B3A]/60 text-sm">
          Vous n'avez pas trouvé votre réponse ?
          <a href="https://wa.me/212723908603" className="text-[#B5704A] font-semibold hover:underline ml-2">Contactez notre équipe sur WhatsApp</a>
        </p>
      </div>
    </main>
  );
}