import { NextResponse } from 'next/server';
import { client } from '../../../sanity/client';

// Fallback models for normal chat (no image)
const fallbackModels = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free"
];

// Sanity se real products fetch karne ka function
async function getProductsForAI() {
  try {
    const products = await client.fetch(`
      *[_type == "cosmeticProduct" && inStock != false] | order(_createdAt desc)[0...20] {
        "name": coalesce(name_fr, name),
        price,
        category,
        "description": coalesce(description_fr, description)
      }
    `);

    if (!products || products.length === 0) return "Aucun produit disponible pour le moment.";

    return products
      .map(p => `- "${p.name}" (${p.category || 'Beauté'}) - ${p.price} MAD${p.description ? ` : ${p.description}` : ''}`)
      .join('\n');
  } catch (err) {
    console.error('Sanity products fetch error:', err);
    // Fallback si Sanity échoue
    return `- "Sérum Éclat" (Soins) - 350 MAD
- "Crème Hydratante Nuit" (Soins) - 280 MAD
- "Oud Royal" (Parfums) - 850 MAD`;
  }
}

function buildSystemPrompt(productsText, hasImage) {
  const basePersona = `You are "Amina", a professional dermatologist and skincare expert at "Cosmétiques Amina" in Casablanca, Morocco.
You speak the SAME language as the customer automatically:
- Customer writes in English → you reply in English
- Customer writes in French → you reply in French  
- Customer writes in Arabic/Darija → you reply in Arabic/Darija
- Default: French

YOUR PERSONALITY: Warm, caring, professional — like a trusted friend who happens to be a skin expert. Never robotic.

=== DERMATOLOGIST CONVERSATION PROTOCOL ===

STEP 1 — GREETING (first message only):
- Introduce yourself warmly as Amina
- Ask for their FIRST NAME to personalize the consultation
- Example: "Hello! I'm Amina, your skincare expert. What's your name? I'd love to personalize your consultation! 🌸"

STEP 2 — INTAKE QUESTIONS (ask ONE question at a time, never all at once):
After getting their name, gather info naturally through conversation:
a) Age range (teens / 20s / 30s / 40s+) — affects product recommendations
b) Main skin concern (acne, dryness, oiliness, pigmentation, aging, sensitivity, etc.)
c) Current skincare routine — what are they already using?
d) Lifestyle factors (water intake, sun exposure, stress level)

STEP 3 — REQUEST PHOTO (after gathering basic info):
Once you understand their concerns, ask:
"To give you the most accurate analysis, could you send me a clear photo of your face in natural light? 📸 This will help me see exactly what your skin needs."

STEP 4 — ANALYSIS (only after receiving photo OR enough info):
If photo received:
⚠️ If image is NOT a real human skin photo (cartoon, avatar, object, landscape): politely say "This doesn't appear to be a skin photo. Please send a clear photo of your face in natural light for accurate analysis. 📸"

If real skin photo:
🔍 **Skin Analysis**
[skin type + visible concerns]

✨ **Personalized Recommendations** 
[max 3 products from our catalogue with WHY each one suits their skin]

💧 **Your Daily Routine**
AM: [morning steps]
PM: [evening steps]

💡 **Bonus Tip**
[1 lifestyle tip]

STEP 5 — FOLLOW UP:
After recommendations, ask if they have questions or want to order.

=== IMPORTANT RULES ===
- Ask ONE question at a time — never dump all questions at once
- Keep responses SHORT (max 3-4 sentences) until photo/full analysis
- NEVER recommend products you don't have in the catalogue
- NEVER give advice for serious skin conditions (refer to a real doctor)
- ALWAYS mention exact prices when recommending products
- If customer seems ready to buy, guide them to add to cart
`;

  const skinAnalysisInstructions = '';

  return `${basePersona}

=== NOTRE CATALOGUE (produits disponibles) ===
${productsText}

RÈGLES IMPORTANTES :
- Ne recommande QUE les produits de notre catalogue ci-dessus
- Toujours mentionner le prix exact
- Si un produit ne convient pas, dis-le honnêtement
- Ne jamais inventer de produits ou de prix
- Limite tes réponses à 250 mots maximum pour rester lisible sur mobile`;
}

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Check if any message contains an image
    const hasImage = messages.some(msg => msg.image);

    // Sanity se real products fetch karo
    const productsText = await getProductsForAI();
    const systemPromptText = buildSystemPrompt(productsText, hasImage);

    // ==========================================
    // GEMINI (Primary — handles both image + text)
    // ==========================================
    if (process.env.GEMINI_API_KEY) {
      try {
        // Model selection:
        // Image ke saath → gemini-3.1-pro-preview (best vision + reasoning)
        // Normal chat → gemini-3.5-flash (fast + free tier friendly)
        const model = hasImage ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const geminiContents = messages.map(msg => {
          const parts = [];

          // Text content
          if (msg.content) {
            parts.push({ text: msg.content });
          }

          // Image content — detect actual mime type from base64 prefix
          if (msg.image) {
            const mimeMatch = msg.image.match(/^data:([^;]+);base64,/);
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const base64Data = msg.image.split(',')[1];

            parts.push({
              inlineData: {
                mimeType,
                data: base64Data
              }
            });
          }

          return {
            role: msg.role === 'user' ? 'user' : 'model',
            parts
          };
        });

        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPromptText }]
            },
            contents: geminiContents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: hasImage ? 1500 : 600,  // More tokens for skin analysis
            }
          })
        });

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          const errText = await geminiResponse.text();
          console.error("Gemini API error:", geminiResponse.status, errText);
        }
      } catch (e) {
        console.error("Gemini fetch error:", e.message);
      }
    }

    // ==========================================
    // OPENROUTER FALLBACK (text only, no image)
    // ==========================================
    if (!hasImage && process.env.OPENROUTER_API_KEY) {
      const openRouterMessages = [
        { role: 'system', content: systemPromptText },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      for (const modelName of fallbackModels) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://aminacosmetics.com',
            },
            body: JSON.stringify({
              model: modelName,
              messages: openRouterMessages,
              max_tokens: 500,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) return NextResponse.json({ reply });
          }
        } catch (e) {
          console.error(`OpenRouter ${modelName} error:`, e.message);
          continue;
        }
      }
    }

    // Last resort fallback
    return NextResponse.json({
      reply: hasImage
        ? "Je n'ai pas pu analyser votre photo pour le moment. Pouvez-vous décrire votre type de peau en quelques mots ? Je vous aiderai avec plaisir. 🌸"
        : "Notre système est momentanément occupé. N'hésitez pas à explorer notre catalogue ou à nous contacter via WhatsApp ! ✨"
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}