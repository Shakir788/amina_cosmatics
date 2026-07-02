'use client';
import { useState, useEffect } from 'react';
import { client } from '../sanity/client';

// Star display
function Stars({ rating, size = 'sm', interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : 'button'}
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${sz} transition-colors ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          aria-label={interactive ? `${star} étoiles` : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={(hovered || rating) >= star ? '#D4A574' : 'none'}
              stroke={(hovered || rating) >= star ? '#D4A574' : '#E8D9C5'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Single review card
function ReviewCard({ review }) {
  const initials = review.customerName
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="bg-white rounded-[20px] border border-[#E8D9C5] p-6 shadow-[0_4px_20px_-8px_rgba(28,20,16,0.08)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1C1410] text-[#D4A574] flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-[#1C1410] text-sm font-medium">{review.customerName}</p>
            {review.city && (
              <p className="text-[10px] text-[#7A4B3A]/55 uppercase tracking-wider">{review.city}</p>
            )}
          </div>
        </div>
        <Stars rating={review.rating} size="sm" />
      </div>
      <p className="text-[#1C1410]/70 text-sm leading-relaxed">{review.comment}</p>
      <p className="text-[10px] text-[#7A4B3A]/40 mt-3 uppercase tracking-wider">
        {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  );
}

// Submit review form
function ReviewForm({ productId, onSuccess }) {
  const [form, setForm] = useState({ customerName: '', city: '', rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { setError('Veuillez sélectionner une note.'); return; }
    if (!form.comment.trim()) { setError('Veuillez écrire un commentaire.'); return; }
    setError('');
    setSubmitting(true);

    try {
      // Write to Sanity via API route (to protect write token)
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productId }),
      });
      if (!res.ok) throw new Error('Erreur');
      onSuccess?.();
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-[#E8D9C5] p-8 shadow-[0_4px_20px_-8px_rgba(28,20,16,0.08)]">
      <h3 className="text-xl text-[#1C1410] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
        Laisser un avis
      </h3>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A4B3A]/70 font-semibold block mb-1.5">
              Nom *
            </label>
            <input
              type="text" required maxLength={60}
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full border-b-2 border-[#E8D9C5] bg-transparent py-2 text-sm text-[#1C1410] focus:border-[#B5704A] outline-none transition-colors"
              placeholder="Votre prénom"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A4B3A]/70 font-semibold block mb-1.5">
              Ville
            </label>
            <input
              type="text" maxLength={40}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border-b-2 border-[#E8D9C5] bg-transparent py-2 text-sm text-[#1C1410] focus:border-[#B5704A] outline-none transition-colors"
              placeholder="Casablanca..."
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A4B3A]/70 font-semibold block mb-2">
            Note *
          </label>
          <Stars rating={form.rating} size="lg" interactive onRate={(r) => setForm({ ...form, rating: r })} />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A4B3A]/70 font-semibold block mb-1.5">
            Commentaire *
          </label>
          <textarea
            required maxLength={500} rows={3}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full border-b-2 border-[#E8D9C5] bg-transparent py-2 text-sm text-[#1C1410] focus:border-[#B5704A] outline-none transition-colors resize-none"
            placeholder="Partagez votre expérience avec ce produit..."
          />
          <p className="text-[10px] text-[#7A4B3A]/40 mt-1 text-right">{form.comment.length}/500</p>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

      <button
        type="submit" disabled={submitting}
        className="mt-6 w-full bg-[#1C1410] text-[#FBF6F0] py-4 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] animate-bounce" />Envoi...</>
        ) : (
          <><span className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />Publier mon avis</>
        )}
      </button>
      <p className="text-[10px] text-[#7A4B3A]/45 text-center mt-3 uppercase tracking-wider">
        Votre avis sera visible après validation
      </p>
    </form>
  );
}

// Main Reviews section — used in product detail page
export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await client.fetch(
        `*[_type == "review" && productId._ref == $id && approved == true] | order(createdAt desc) {
          _id, customerName, city, rating, comment, createdAt
        }`,
        { id: productId }
      );
      setReviews(data);
    } catch (e) {
      console.error('Reviews fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="mt-20 max-w-[1200px] mx-auto px-6 md:px-12 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-[#B5704A] uppercase tracking-[0.3em] text-[11px] font-semibold mb-2">
            Avis clients
          </p>
          <h2 className="text-3xl text-[#1C1410] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Ce qu'elles en pensent
          </h2>
        </div>

        {avgRating && (
          <div className="text-right">
            <p className="text-4xl text-[#1C1410]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
              {avgRating}<span className="text-xl text-[#B5704A]">/5</span>
            </p>
            <Stars rating={Math.round(avgRating)} size="sm" />
            <p className="text-[10px] text-[#7A4B3A]/55 mt-1 uppercase tracking-wider">
              {reviews.length} avis
            </p>
          </div>
        )}
      </div>

      {/* Reviews grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-[20px] border border-[#E8D9C5] p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#F0E4D4]" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-[#E8D9C5] rounded-full w-1/3" />
                  <div className="h-2 bg-[#E8D9C5] rounded-full w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#E8D9C5] rounded-full" />
                <div className="h-3 bg-[#E8D9C5] rounded-full w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      ) : (
        <div className="text-center py-12 mb-10">
          <p className="text-[#1C1410]/50 text-sm">Aucun avis pour le moment — soyez la première ! ✨</p>
        </div>
      )}

      {/* Submit section */}
      {submitted ? (
        <div className="bg-white rounded-[24px] border border-[#E8D9C5] p-8 text-center">
          <p className="text-2xl text-[#1C1410] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Merci pour votre avis ! 🌸
          </p>
          <p className="text-[#7A4B3A]/60 text-sm">Il sera visible après validation par notre équipe.</p>
        </div>
      ) : showForm ? (
        <ReviewForm productId={productId} onSuccess={() => setSubmitted(true)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-[#E8D9C5] rounded-[24px] py-8 text-[#7A4B3A]/60 hover:border-[#B5704A] hover:text-[#B5704A] transition-colors text-sm font-medium uppercase tracking-[0.2em]"
        >
          + Laisser un avis
        </button>
      )}
    </section>
  );
}