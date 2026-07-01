'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Camera, RefreshCw, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const INITIAL_MESSAGE = { role: 'assistant', content: "Bonjour ! Je suis Amina, votre experte beauté. Posez-moi vos questions ou envoyez-moi une photo de votre peau pour une analyse personnalisée. 🌸" };

const QUICK_REPLIES = [
  { label: "📸 Analyser ma peau", value: "Pouvez-vous analyser ma peau ?" },
  { label: "💧 Peau sèche", value: "J'ai la peau sèche, que me conseillez-vous ?" },
  { label: "🔴 Acné", value: "J'ai des problèmes d'acné, aidez-moi." },
  { label: "✨ Anti-âge", value: "Je cherche des produits anti-âge." },
];

// Compress image before API (max 800px, quality 0.7)
function compressImage(base64, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64;
  });
}

function AminaAvatar({ size = 40, className = '' }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      <Image src="/amina-avatar.png" alt="Amina AI" fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
}

function AnalyzingIndicator() {
  return (
    <div className="flex gap-3 justify-start items-end">
      <AminaAvatar size={32} className="shrink-0 mb-1 border border-[#E8D9C5]" />
      <div className="bg-white border border-[#E8D9C5] rounded-[20px] rounded-tl-[4px] px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B5704A] font-semibold">Analyse en cours</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-bounce" />
          </span>
        </div>
        <div className="w-40 h-1.5 bg-[#F0E4D4] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#B5704A] to-[#D4A574] rounded-full" style={{ animation: 'scan 1.5s ease-in-out infinite' }} />
        </div>
        <p className="text-[10px] text-[#7A4B3A]/60 mt-2">Détection du type de peau...</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start items-end">
      <AminaAvatar size={32} className="shrink-0 mb-1 border border-[#E8D9C5]" />
      <div className="bg-white border border-[#E8D9C5] rounded-[20px] rounded-tl-[4px] py-3 px-4 flex gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-[#D4A574] rounded-full animate-bounce" />
      </div>
    </div>
  );
}

function MessageContent({ content }) {
  return (
    <>
      {content.split('\n').map((line, i, arr) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} className="font-semibold">{part}</strong>
                : <span key={j}>{part}</span>
            )}
            {i < arr.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [hasUnread, setHasUnread] = useState(false); // notification dot
  const [viewportHeight, setViewportHeight] = useState('100dvh'); // mobile keyboard fix

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isAnalyzing]);

  // Show notification dot after 3s if chat is closed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasUnread(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Clear notification when opened
  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  // Mobile keyboard fix — track visual viewport height
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(`${window.visualViewport.height}px`);
      }
    };
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result;
      setPreviewImage(raw);
      const compressed = await compressImage(raw);
      setSelectedImage(compressed);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async (textOverride) => {
    const text = textOverride ?? input;
    if (!text.trim() && !selectedImage) return;

    const hasImage = !!selectedImage;
    const userMsg = {
      role: 'user',
      content: text || 'Pouvez-vous analyser ma peau ?',
      image: selectedImage,
      previewImage,
    };

    const apiMessages = [...messages, userMsg].map(({ previewImage: _p, ...rest }) => rest);

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setPreviewImage(null);
    hasImage ? setIsAnalyzing(true) : setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        // Notify if chat is closed
        if (!isOpen) setHasUnread(true);
      } else {
        throw new Error(data.error || 'Error');
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Désolé, ma connexion a été interrompue. Pouvez-vous répéter ? ✨",
      }]);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (value) => {
    sendMessage(value);
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const showQuickReplies = messages.length <= 2 && !isLoading && !isAnalyzing;

  return (
    <>
      <style>{`
        @keyframes scan {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes notif-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>

      <div
        className="fixed bottom-6 right-6 z-[90] flex flex-col items-end"
        style={{ '--vh': viewportHeight }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 w-[350px] sm:w-[400px] bg-[#FBF6F0] rounded-3xl shadow-[0_30px_60px_-15px_rgba(28,20,16,0.3)] border border-[#E8D9C5] flex flex-col overflow-hidden"
              style={{ height: 'min(570px, calc(var(--vh, 100dvh) - 120px))' }}
            >
              {/* Header */}
              <div className="bg-[#1C1410] px-5 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <AminaAvatar size={36} className="border border-[#D4A574]/30" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#1C1410] rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-[#FBF6F0] text-sm font-semibold uppercase tracking-[0.12em]">Amina AI</h3>
                    <p className="text-[#FBF6F0]/55 text-[10px] uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#D4A574]" />
                      Experte Beauté & Dermatologue
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Clear chat button */}
                  <button
                    onClick={clearChat}
                    title="Nouvelle consultation"
                    className="text-[#FBF6F0]/45 hover:text-[#D4A574] transition-colors p-1.5 rounded-full hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {/* WhatsApp handoff */}
                  <a
                    href="https://wa.me/212XXXXXXXXXX?text=Bonjour, j'ai besoin d'aide avec ma consultation beauté."
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Parler à un humain"
                    className="text-[#FBF6F0]/45 hover:text-[#25D366] transition-colors p-1.5 rounded-full hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Close */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#FBF6F0]/50 hover:text-[#FBF6F0] transition-colors p-1.5 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FBF6F0]/60">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end`}
                  >
                    {msg.role === 'assistant' && (
                      <AminaAvatar size={26} className="shrink-0 mb-0.5 border border-[#E8D9C5]" />
                    )}
                    <div
                      className={`text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#1C1410] text-[#FBF6F0] rounded-[18px] rounded-tr-[4px] shadow-md px-4 py-3 max-w-[80%]'
                          : 'bg-white text-[#1C1410] border border-[#E8D9C5] rounded-[18px] rounded-tl-[4px] shadow-sm px-4 py-3 max-w-[85%]'
                      }`}
                    >
                      {(msg.previewImage || msg.image) && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden mb-2 border border-white/20 relative">
                          <Image src={msg.previewImage || msg.image} alt="Photo" fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <MessageContent content={msg.content} />
                    </div>
                  </div>
                ))}

                {/* Quick replies — only shown at start */}
                {showQuickReplies && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.value}
                        onClick={() => handleQuickReply(qr.value)}
                        className="text-[11px] bg-white border border-[#E8D9C5] text-[#1C1410] px-3 py-1.5 rounded-full hover:border-[#B5704A] hover:text-[#B5704A] transition-colors shadow-sm"
                      >
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}

                {isAnalyzing && <AnalyzingIndicator />}
                {isLoading && !isAnalyzing && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-[#E8D9C5] p-3 flex flex-col gap-2 shrink-0">
                {previewImage && (
                  <div className="flex items-center gap-2 pl-1">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-[#D4A574] shadow-sm shrink-0">
                      <Image src={previewImage} alt="Preview" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => { setSelectedImage(null); setPreviewImage(null); }}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-[#7A4B3A]/70 italic">Photo prête pour analyse ✨</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Envoyer une photo"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C1410]/40 hover:text-[#B5704A] hover:bg-[#FBF6F0] transition-colors shrink-0"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedImage ? 'Ajouter un message...' : 'Posez votre question...'}
                    className="flex-1 bg-[#FBF6F0] border border-[#E8D9C5] rounded-full py-2.5 pl-4 pr-3 text-sm focus:outline-none focus:border-[#B5704A] text-[#1C1410] placeholder:text-[#1C1410]/35 transition-colors min-w-0"
                    disabled={isLoading || isAnalyzing}
                  />

                  <button
                    type="submit"
                    disabled={(!input.trim() && !selectedImage) || isLoading || isAnalyzing}
                    className="w-9 h-9 rounded-full bg-[#1C1410] text-[#FBF6F0] flex items-center justify-center hover:bg-[#B5704A] disabled:opacity-40 transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Parler à Amina"
          className={`relative group flex items-center justify-center w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(28,20,16,0.3)] transition-all hover:scale-105 active:scale-95 ${
            isOpen ? 'bg-[#1C1410]' : 'bg-[#B5704A]'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#FBF6F0]" />
          ) : (
            <AminaAvatar size={56} className="w-full h-full rounded-full" />
          )}

          {/* Notification dot */}
          {hasUnread && !isOpen && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"
              style={{ animation: 'notif-pulse 1.5s ease-in-out infinite' }}
            />
          )}
        </button>
      </div>
    </>
  );
}