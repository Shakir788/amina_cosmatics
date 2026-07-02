'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Droplets, Sun, Wind, Leaf } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const SKIN_LABELS = {
  dry: "peau sèche",
  oily: "peau grasse",
  combination: "peau mixte",
  normal: "peau normale",
};

/**
 * The quiz has a fixed length of 10 steps, but step 4 (concernDetail) changes
 * its question and options depending on what was picked at step 3 (concern).
 * Every other question is fixed. Because steps are answered in order, by the
 * time we render a branch-dependent question, the answer it depends on
 * already exists in `answers`.
 */
function getQuizQuestions(answers) {
  const concernDetailByConcern = {
    glow: {
      title: "D'où viennent vos taches ou votre teint terne, principalement ?",
      options: [
        { label: "Exposition au soleil", value: "sun" },
        { label: "Cicatrices d'acné", value: "acne_marks" },
        { label: "Fatigue & teint terne", value: "dullness" },
      ]
    },
    hydration: {
      title: "Quand ressentez-vous le plus de tiraillements ?",
      options: [
        { label: "Toute la journée", value: "allday" },
        { label: "Seulement le soir", value: "evening" },
        { label: "Juste après la douche", value: "aftershower" },
      ]
    },
    aging: {
      title: "Quelle est votre priorité anti-âge ?",
      options: [
        { label: "Ridules fines", value: "fine_lines" },
        { label: "Fermeté & relâchement", value: "firmness" },
        { label: "Taches de vieillesse", value: "age_spots" },
      ]
    },
  };

  const concernDetail = concernDetailByConcern[answers.concern] || {
    title: "Quelle est votre priorité principale ?",
    options: [{ label: "Continuer", value: "general" }]
  };

  return [
    {
      id: 'skinType',
      title: "Quel est votre type de peau ?",
      options: [
        { label: "Sèche", icon: Wind, value: "dry" },
        { label: "Grasse", icon: Droplets, value: "oily" },
        { label: "Mixte", icon: Sun, value: "combination" },
        { label: "Normale", icon: Leaf, value: "normal" },
      ]
    },
    {
      id: 'sensitivity',
      title: "Votre peau réagit-elle facilement (rougeurs, tiraillements) ?",
      options: [
        { label: "Oui, plutôt sensible", value: "sensitive" },
        { label: "Non, elle tolère bien", value: "resilient" },
      ]
    },
    {
      id: 'concern',
      title: "Quelle est votre préoccupation principale ?",
      options: [
        { label: "Éclat & Taches", value: "glow" },
        { label: "Hydratation", value: "hydration" },
        { label: "Anti-âge", value: "aging" },
      ]
    },
    {
      id: 'concernDetail',
      title: concernDetail.title,
      options: concernDetail.options,
    },
    {
      id: 'spf',
      title: "Utilisez-vous une protection solaire au quotidien ?",
      options: [
        { label: "Oui, toujours", value: "always" },
        { label: "Parfois", value: "sometimes" },
        { label: "Jamais", value: "never" },
      ]
    },
    {
      id: 'climate',
      title: "Votre environnement est plutôt :",
      options: [
        { label: "Humide", value: "humid" },
        { label: "Sec", value: "dry_climate" },
        { label: "Urbain & pollué", value: "urban" },
      ]
    },
    {
      id: 'activesExperience',
      title: "Utilisez-vous déjà des actifs comme le rétinol ou les acides exfoliants ?",
      options: [
        { label: "Oui, régulièrement", value: "regular" },
        { label: "Occasionnellement", value: "occasional" },
        { label: "Jamais", value: "never" },
      ]
    },
    {
      id: 'ageRange',
      title: "Quelle est votre tranche d'âge ?",
      options: [
        { label: "Moins de 25 ans", value: "under25" },
        { label: "25 à 40 ans", value: "25to40" },
        { label: "Plus de 40 ans", value: "over40" },
      ]
    },
    {
      id: 'routineDepth',
      title: "Combien de temps voulez-vous consacrer à votre routine ?",
      options: [
        { label: "Rapide — l'essentiel", value: "essential" },
        { label: "J'aime prendre soin de moi", value: "complete" },
      ]
    },
    {
      id: 'moment',
      title: "À quel moment complétez-vous votre routine ?",
      options: [
        { label: "Matin", value: "morning" },
        { label: "Soir", value: "evening" },
        { label: "Matin et soir", value: "both" },
      ]
    },
  ];
}

const COMPLEMENTARY_PRODUCTS = {
  glow: { _id: "prod_comp_glow", name: "Exfoliant Doux AHA", price: 220 },
  hydration: { _id: "prod_comp_hyd", name: "Masque Hydratant Nuit", price: 240 },
  aging: { _id: "prod_comp_age", name: "Contour des Yeux Repulpant", price: 260 },
};

const SPF_PRODUCT = { _id: "prod_spf_50", name: "Fluide Solaire SPF50 Invisible", price: 210 };

const FOCUS_NOTES = {
  sun: "Vos taches viennent surtout du soleil : la protection solaire est non-négociable dans cette routine.",
  acne_marks: "Pour les marques résiduelles, on mise sur des actifs éclaircissants doux plutôt qu'agressifs.",
  dullness: "Pour relancer l'éclat, l'exfoliation douce et la vitamine C sont vos meilleures alliées.",
  allday: "Une routine renforcée en agents filmogènes pour tenir toute la journée sans tiraillement.",
  evening: "Focus sur une hydratation réparatrice le soir, quand la peau se régénère.",
  aftershower: "Un geste à appliquer sur peau encore légèrement humide pour sceller l'hydratation.",
  fine_lines: "On cible les ridules fines dès leur apparition, avant qu'elles ne se creusent.",
  firmness: "Priorité aux actifs raffermissants pour la fermeté et le relâchement cutané.",
  age_spots: "Priorité aux actifs anti-taches pour uniformiser une peau marquée par le temps.",
};

const CLIMATE_NOTES = {
  humid: "Textures allégées, pour ne pas alourdir la peau dans un climat humide.",
  dry_climate: "Formules enrichies, pour compenser un climat sec qui déshydrate la peau.",
  urban: "Enrichie en antioxydants pour contrer l'impact de la pollution urbaine.",
};

const AGE_NOTES = {
  under25: "Une approche préventive et en douceur, adaptée à votre âge.",
  '25to40': "Une routine de maintien, ciblée sur vos besoins actuels.",
  over40: "Une routine plus intensive, pensée pour une peau mature.",
};

const MOMENT_INSTRUCTIONS = {
  morning: "Le matin : nettoyant doux → sérum → protection solaire.",
  evening: "Le soir : nettoyant doux → sérum → crème.",
  both: "Matin : nettoyant → sérum → SPF. Soir : nettoyant → sérum → crème (le rétinol s'applique uniquement le soir).",
};

// Base matrix: skinType x concern. "normal" and any unmapped skin type
// fall back to the balanced "combination" formulation.
const RECOMMENDATIONS = {
  glow: {
    dry: {
      name: "Routine Éclat & Nutrition",
      description: "Une formule Vitamine C enrichie en huiles nourrissantes pour raviver l'éclat sans assécher.",
      products: [
        { _id: "prod_glow_dry_1", name: "Sérum Éclat Vitamine C Riche", price: 350 },
        { _id: "prod_glow_dry_2", name: "Crème Protectrice Nourrissante", price: 290 }
      ],
    },
    oily: {
      name: "Routine Éclat Matifiante",
      description: "Une texture fluide et non-comédogène qui unifie le teint sans effet gras.",
      products: [
        { _id: "prod_glow_oily_1", name: "Sérum Éclat Vitamine C Fluide", price: 350 },
        { _id: "prod_glow_oily_2", name: "Fluide Protecteur Matifiant", price: 280 }
      ],
    },
    combination: {
      name: "Routine Éclat Équilibrante",
      description: "Un duo léger qui unifie le teint et régule les zones mixtes en douceur.",
      products: [
        { _id: "prod_glow_comb_1", name: "Sérum Éclat Vitamine C", price: 350 },
        { _id: "prod_glow_comb_2", name: "Crème Protectrice Jour", price: 280 }
      ],
    },
  },
  hydration: {
    dry: {
      name: "Routine Hydratation Profonde",
      description: "Une hydratation intense et durable pour une peau sèche repulpée et confortable.",
      products: [
        { _id: "prod_hyd_dry_1", name: "Sérum Acide Hyaluronique Intense", price: 330 },
        { _id: "prod_hyd_dry_2", name: "Crème Riche Nuit", price: 310 }
      ],
    },
    oily: {
      name: "Routine Hydratation Légère",
      description: "Une hydratation en gel, fraîche et non-grasse, qui apaise sans surcharger.",
      products: [
        { _id: "prod_hyd_oily_1", name: "Sérum Acide Hyaluronique Gel", price: 320 },
        { _id: "prod_hyd_oily_2", name: "Gel-Crème Hydratant", price: 270 }
      ],
    },
    combination: {
      name: "Routine Hydratation Équilibrée",
      description: "Une hydratation modulable qui apaise les zones sèches sans alourdir les zones grasses.",
      products: [
        { _id: "prod_hyd_comb_1", name: "Sérum Acide Hyaluronique", price: 320 },
        { _id: "prod_hyd_comb_2", name: "Crème Hydratante Confort", price: 290 }
      ],
    },
  },
  aging: {
    dry: {
      name: "Routine Jeunesse Nourrissante",
      description: "Rétinol doux associé à des actifs nourrissants pour lisser sans fragiliser une peau sèche.",
      products: [
        { _id: "prod_age_dry_1", name: "Sérum Rétinol Doux Nourrissant", price: 450 },
        { _id: "prod_age_dry_2", name: "Crème Collagène Riche", price: 390 }
      ],
    },
    oily: {
      name: "Routine Jeunesse Non-Grasse",
      description: "Rétinol en texture légère pour raffermir sans obstruer les pores.",
      products: [
        { _id: "prod_age_oily_1", name: "Sérum Rétinol Doux Fluide", price: 450 },
        { _id: "prod_age_oily_2", name: "Fluide Collagène Matifiant", price: 380 }
      ],
    },
    combination: {
      name: "Routine Jeunesse Absolue",
      description: "Le duo équilibré pour lisser les ridules et raffermir la peau, zone par zone.",
      products: [
        { _id: "prod_age_comb_1", name: "Sérum Rétinol Doux", price: 450 },
        { _id: "prod_age_comb_2", name: "Crème Collagène", price: 380 }
      ],
    },
  }
};

function getRecommendation(answers) {
  const byConcern = RECOMMENDATIONS[answers.concern];
  if (!byConcern) return null;
  const base = byConcern[answers.skinType] || byConcern.combination;

  let products = [...base.products];
  const notes = [];

  // Routine depth changes what's actually in the bundle.
  if (answers.routineDepth === 'complete') {
    const extra = COMPLEMENTARY_PRODUCTS[answers.concern];
    if (extra) products = [...products, extra];
  }

  // No daily SPF -> the routine isn't complete without it, so we add it.
  const spfIncluded = answers.spf === 'never';
  if (spfIncluded && !products.some(p => p._id === SPF_PRODUCT._id)) {
    products = [...products, SPF_PRODUCT];
    notes.push("Vous n'utilisez pas de protection solaire au quotidien : on l'a ajoutée, c'est l'étape la plus importante contre le vieillissement cutané.");
  } else if (answers.spf === 'sometimes') {
    notes.push("Pensez à rendre votre protection solaire quotidienne, pas seulement occasionnelle.");
  }

  const isSensitive = answers.sensitivity === 'sensitive';
  if (isSensitive) {
    notes.push("Formules sélectionnées pour les peaux sensibles : testées dermatologiquement, sans parfum irritant.");
  }

  if (FOCUS_NOTES[answers.concernDetail]) {
    notes.push(FOCUS_NOTES[answers.concernDetail]);
  }

  if (CLIMATE_NOTES[answers.climate]) {
    notes.push(CLIMATE_NOTES[answers.climate]);
  }

  if (AGE_NOTES[answers.ageRange]) {
    notes.push(AGE_NOTES[answers.ageRange]);
  }

  if (answers.concern === 'aging' && answers.activesExperience === 'never') {
    notes.push("Première utilisation de rétinol : à intégrer progressivement, 2 à 3 soirs par semaine au départ.");
  }

  if (MOMENT_INSTRUCTIONS[answers.moment]) {
    notes.push(MOMENT_INSTRUCTIONS[answers.moment]);
  }

  const total = products.reduce((sum, p) => sum + p.price, 0);

  return {
    name: base.name,
    description: base.description,
    products,
    notes,
    total,
    isSensitive,
    isComplete: answers.routineDepth === 'complete',
    spfIncluded,
  };
}

export default function SkinQuiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  const questions = getQuizQuestions(answers);
  const totalSteps = questions.length;

  const handleSelect = (questionId, value) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Finish Quiz -> Start Analysis
      setIsAnalyzing(true);
      setStep(step + 1);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 2500); // 2.5 seconds of fake analyzing for premium feel
    }
  };

  const handleAddBundle = (routine) => {
    routine.products.forEach(prod => {
      addToCart({ id: prod._id, name: prod.name, price: `${prod.price} MAD` });
    });
    onClose(); // Close modal
    openCart(); // Open cart to close the sale
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    onClose();
  };

  const recommendation = getRecommendation(answers);
  const skinLabel = SKIN_LABELS[answers.skinType];
  const currentQuestion = questions[step];
  const optionCount = currentQuestion ? currentQuestion.options.length : 0;
  const gridColsClass =
    optionCount === 2 ? 'sm:grid-cols-2' :
    optionCount === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
    'sm:grid-cols-3';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FBF6F0]/90 backdrop-blur-md p-4 sm:p-6"
        >
          <button onClick={resetQuiz} className="absolute top-6 right-6 p-2 text-[#1C1410]/50 hover:text-[#1C1410] transition-colors">
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-2xl bg-white border border-[#E8D9C5] rounded-[40px] shadow-[0_30px_60px_-15px_rgba(28,20,16,0.1)] overflow-hidden relative min-h-[560px] flex flex-col">

            {/* Top Progress Bar */}
            {step < totalSteps && (
              <div className="h-1.5 bg-[#F0E4D4] w-full absolute top-0 left-0">
                <motion.div
                  className="h-full bg-[#B5704A]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12">
              <AnimatePresence mode="wait">

                {step < totalSteps && currentQuestion && (
                  <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="w-full text-center"
                  >
                    <span className="text-[11px] uppercase tracking-[0.3em] text-[#B5704A] font-semibold mb-4 block">
                      Étape {step + 1} sur {totalSteps}
                    </span>
                    <h2
                      className="text-3xl sm:text-4xl text-[#1C1410] mb-10"
                      style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                    >
                      {currentQuestion.title}
                    </h2>

                    <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
                      {currentQuestion.options.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelect(currentQuestion.id, opt.value)}
                            className="group flex flex-col items-center justify-center p-6 border border-[#E8D9C5] rounded-3xl hover:border-[#B5704A] hover:bg-[#FBF6F0] transition-all duration-300 active:scale-95"
                          >
                            {Icon && <Icon className="w-8 h-8 text-[#1C1410]/40 group-hover:text-[#B5704A] mb-3 transition-colors" />}
                            <span className="font-medium text-[#1C1410]">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Analyzing Step — references the actual answers collected so far */}
                {step === totalSteps && isAnalyzing && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 mb-6 relative flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-[#F0E4D4] rounded-full" />
                      <motion.div
                        className="absolute inset-0 border-4 border-[#B5704A] rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                      <Sparkles className="w-8 h-8 text-[#D4A574]" />
                    </div>
                    <h2 className="text-2xl text-[#1C1410] font-serif mb-2">Analyse en cours...</h2>
                    <p className="text-[#1C1410]/60 text-sm max-w-sm">
                      Croisement de vos 10 réponses : {skinLabel}
                      {answers.sensitivity === 'sensitive' ? ', peau sensible' : ''}, priorité{' '}
                      {answers.concern === 'glow' && "éclat & taches"}
                      {answers.concern === 'hydration' && "hydratation"}
                      {answers.concern === 'aging' && "anti-âge"}
                      , climat {answers.climate === 'humid' ? 'humide' : answers.climate === 'dry_climate' ? 'sec' : 'urbain'}…
                    </p>
                  </motion.div>
                )}

                {/* Result Step */}
                {step === totalSteps && !isAnalyzing && recommendation && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4A574]/10 text-[#B5704A] mb-6">
                      <Sparkles className="w-8 h-8" />
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-[#B5704A] font-semibold">
                        {skinLabel}
                      </span>
                      <span className="text-[11px] text-[#1C1410]/40">•</span>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-[#1C1410]/50 font-semibold">
                        {recommendation.isComplete ? 'Rituel complet' : 'Rituel essentiel'}
                      </span>
                      {recommendation.isSensitive && (
                        <>
                          <span className="text-[11px] text-[#1C1410]/40">•</span>
                          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1C1410]/50 font-semibold">
                            Peau sensible
                          </span>
                        </>
                      )}
                      {recommendation.spfIncluded && (
                        <>
                          <span className="text-[11px] text-[#1C1410]/40">•</span>
                          <span className="text-[11px] uppercase tracking-[0.3em] text-[#1C1410]/50 font-semibold">
                            SPF ajouté
                          </span>
                        </>
                      )}
                    </div>

                    <h2
                      className="text-3xl sm:text-4xl text-[#1C1410] mb-4"
                      style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                    >
                      {recommendation.name}
                    </h2>
                    <p className="text-[#1C1410]/70 mb-6 leading-relaxed">
                      {recommendation.description}
                    </p>

                    {recommendation.notes.length > 0 && (
                      <div className="text-left bg-white border border-[#E8D9C5] rounded-3xl p-5 mb-6 space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B5704A] font-semibold block mb-2">
                          Votre analyse personnalisée
                        </span>
                        {recommendation.notes.map((note, i) => (
                          <p key={i} className="text-sm text-[#1C1410]/70 leading-relaxed">
                            • {note}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="bg-[#FBF6F0] border border-[#E8D9C5] rounded-3xl p-6 mb-8 text-left space-y-4">
                      {recommendation.products.map(prod => (
                        <div key={prod._id} className="flex justify-between items-center pb-4 border-b border-[#E8D9C5]/50 last:border-0 last:pb-0">
                          <span className="font-medium text-[#1C1410]">{prod.name}</span>
                          <span className="text-[#B5704A] font-semibold">{prod.price} MAD</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 text-sm text-[#1C1410]/60">
                        <span>Total routine</span>
                        <span>{recommendation.total} MAD</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddBundle(recommendation)}
                      className="w-full bg-[#1C1410] text-[#FBF6F0] py-4.5 rounded-full font-semibold uppercase tracking-[0.2em] text-sm hover:bg-[#B5704A] transition-colors duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                      Ajouter la routine au panier <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}