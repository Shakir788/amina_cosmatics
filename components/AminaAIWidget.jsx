'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function AminaAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Bonjour ! Je suis Amina, votre experte beauté. Cherchez-vous une routine spécifique aujourd'hui ?" 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');

    // Simulate AI Sales Closer response (You will connect this to Gemini later)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Pour raviver l'éclat de votre peau, je vous recommande absolument notre best-seller :",
        product: {
          _id: "prod_glow_ai",
          name: "Sérum Éclat Vitamine C",
          price: "350",
          category: "Soin Ciblée"
        }
      }]);
    }, 1500);
  };

  const handleBuyNow = (product) => {
    addToCart({ id: product._id, name: product.name, price: `${product.price} MAD` });
    setIsOpen(false);
    openCart();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90]">
      <AnimatePresence>
        {/* The Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="absolute bottom-20 right-0 w-[90vw] max-w-[360px] bg-[#FBF6F0] rounded-[32px] shadow-[0_30px_60px_-15px_rgba(28,20,16,0.3)] border border-[#E8D9C5] overflow-hidden flex flex-col"
            style={{ height: '550px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-[#1C1410] px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B5704A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#FBF6F0]" />
                </div>
                <div>
                  <h3 className="text-[#FBF6F0] font-serif text-lg leading-tight">Amina AI</h3>
                  <p className="text-[#FBF6F0]/60 text-[10px] uppercase tracking-widest">Conseillère Beauté</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#FBF6F0]/60 hover:text-[#FBF6F0] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/40">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[85%] p-4 text-sm rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-[#1C1410] text-[#FBF6F0] rounded-br-sm' 
                        : 'bg-white border border-[#E8D9C5] text-[#1C1410] rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  
                  {/* Dynamic Product Recommendation Card inside Chat! */}
                  {msg.product && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 w-[85%] bg-white border border-[#B5704A]/30 rounded-2xl p-4 shadow-md"
                    >
                      <span className="text-[10px] uppercase tracking-widest text-[#B5704A] font-bold block mb-1">
                        {msg.product.category}
                      </span>
                      <h4 className="font-serif text-[#1C1410] text-base mb-1">{msg.product.name}</h4>
                      <p className="text-[#1C1410] font-semibold text-sm mb-4">{msg.product.price} MAD</p>
                      <button 
                        onClick={() => handleBuyNow(msg.product)}
                        className="w-full flex items-center justify-center gap-2 bg-[#1C1410] text-[#FBF6F0] py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#B5704A] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Ajouter
                      </button>
                    </motion.div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#E8D9C5] shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..." 
                  className="w-full bg-[#F0E4D4]/50 border border-[#E8D9C5] rounded-full py-3.5 pl-5 pr-12 text-sm text-[#1C1410] placeholder:text-[#1C1410]/40 focus:outline-none focus:border-[#B5704A] transition-colors"
                />
                <button 
                  type="submit"
                  className="absolute right-2 w-9 h-9 flex items-center justify-center bg-[#1C1410] text-[#FBF6F0] rounded-full hover:bg-[#B5704A] transition-colors"
                >
                  <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full bg-[#1C1410] flex items-center justify-center shadow-[0_10px_30px_rgba(28,20,16,0.4)] border border-[#E8D9C5]/20 group"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-[#FBF6F0]" />
        ) : (
          <Sparkles className="w-7 h-7 text-[#D4A574] group-hover:text-[#FBF6F0] transition-colors" />
        )}
      </motion.button>
    </div>
  );
}