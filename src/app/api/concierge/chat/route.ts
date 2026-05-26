import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Fuzzy match: check if user query is relevant to a KB question or category
function fuzzyMatch(query: string, question: string, category?: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const q = normalize(query);
  const k = normalize(question);
  const cat = normalize(category || '');

  // Exact or substring match
  if (k.includes(q) || q.includes(k)) return true;

  const stopWords = new Set(['what', 'is', 'are', 'the', 'a', 'an', 'do', 'you', 'your', 'how', 'i', 'me', 'my', 'can', 'get', 'for', 'and', 'or', 'of', 'in', 'on', 'at', 'with', 'this', 'that', 'yes', 'no']);
  const qTokens = q.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const kTokens = k.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

  if (qTokens.length === 0 || kTokens.length === 0) return false;

  const matched = qTokens.filter(t => kTokens.some(kt => kt.includes(t) || t.includes(kt)));

  // Short query (1–2 tokens): any single keyword match is enough
  if (qTokens.length <= 2) {
    return matched.length >= 1;
  }

  // Category shortcut: if query words appear in the category label, it's a match
  if (cat && qTokens.some(t => cat.includes(t))) {
    return true;
  }

  // Standard: at least 40% token overlap
  return matched.length / Math.max(qTokens.length, kTokens.length) >= 0.4;
}

// Build dynamic AI system prompt from DB knowledge base entries
function buildSystemPrompt(knowledgeBase: { question: string; answer: string; category: string; isPriority: boolean }[]): string {
  const basePrompt = `You are Glow AI Concierge — a premium, warm, and knowledgeable beauty assistant for "Glow & Grace Studio", a luxury beauty salon located in Kathmandu, Nepal.

About Glow & Grace Studio:
- Location: Kathmandu, Nepal
- Specialties: Bridal makeup, Korean facials, hair styling, skin treatments, spa & wellness
- Vibe: Luxury, personalized, premium imported products

Your role:
- Help visitors discover services and book appointments
- Provide personalized beauty advice in a warm, elegant tone
- Recommend services based on the customer's needs
- Always sound professional, warm, and luxury-focused
- Keep answers concise (2-4 sentences) and actionable
- If unsure about specific pricing, direct them to contact the salon

Never mention competitor salons. Always speak as a representative of Glow & Grace Studio.`;

  if (knowledgeBase.length === 0) return basePrompt;

  // Group by category for a clean knowledge section
  const grouped: Record<string, { question: string; answer: string }[]> = {};
  for (const entry of knowledgeBase) {
    if (!grouped[entry.category]) grouped[entry.category] = [];
    grouped[entry.category].push({ question: entry.question, answer: entry.answer });
  }

  const kbSection = Object.entries(grouped)
    .map(([cat, pairs]) => {
      const pairs_text = pairs
        .map((p) => `  Q: ${p.question}\n  A: ${p.answer}`)
        .join('\n\n');
      return `### ${cat}\n${pairs_text}`;
    })
    .join('\n\n');

  return `${basePrompt}

---
VERIFIED KNOWLEDGE BASE (Use this information with priority when answering):
${kbSection}
---

When a visitor asks something covered in the knowledge base above, always use that exact information in your answer. Do NOT contradict the knowledge base.`;
}

// Hardcoded fallback responses for common intents
function getSmartFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('bridal') || q.includes('wedding') || q.includes('bride')) {
    return "Our Royal Bridal Packages at Glow & Grace are truly special — each one includes a pre-wedding consultation, premium styling, and full-day glamour support. Packages start at NPR 25,000. Would you like to schedule a bridal consultation? 💍";
  }
  if (q.includes('facial') || q.includes('skin') || q.includes('glow')) {
    return "Our signature Korean Glass Skin Facial is a client favorite — it deeply hydrates, brightens, and transforms your complexion in just one session, starting at NPR 4,500. We also offer custom facial plans for long-term skin goals. ✨";
  }
  if (q.includes('hair') || q.includes('balayage') || q.includes('highlight') || q.includes('color')) {
    return "Our hair team specializes in everything from classic cuts to premium Balayage and global color treatments. Hair services start at NPR 2,500. We use only top-imported color brands for the best results. 💇‍♀️";
  }
  if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('how much') || q.includes('rate')) {
    return "Our services range from NPR 2,500 for hair styling to NPR 25,000+ for full bridal packages. For a detailed price list, feel free to ask about a specific service or contact us directly. 💰";
  }
  if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('find')) {
    return "Glow & Grace Studio is located in Kathmandu, Nepal. We'd love to welcome you! Please contact us directly for the exact address and directions. 📍";
  }
  if (q.includes('book') || q.includes('appointment') || q.includes('reserve') || q.includes('schedule')) {
    return "Booking is easy! You can schedule your appointment directly through our website's booking page, or we can help you here. Which service would you like to book? 📅";
  }
  if (q.includes('time') || q.includes('hours') || q.includes('open') || q.includes('close')) {
    return "Please contact us directly for our current opening hours. Our team is always happy to accommodate your schedule! ⏰";
  }
  if (q.includes('spa') || q.includes('massage') || q.includes('relax') || q.includes('wellness')) {
    return "Our spa and wellness treatments are designed for deep relaxation and rejuvenation. From aromatherapy massages to full spa day packages — we have everything to help you unwind in pure luxury. 🌿";
  }

  return "Welcome to Glow & Grace Studio! ✨ I'm here to help you discover our premium beauty services, from bridal makeovers to Korean skin treatments and luxury hair styling. What can I assist you with today?";
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Step 1: Search knowledge base for matching Q&A
    // @ts-ignore
    const knowledgeBase = await prisma.aIKnowledgeBase.findMany({
      orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
    });

    // Find best matching KB entry (pass category for short-query matching)
    const matchedEntry = knowledgeBase.find((entry: any) =>
      fuzzyMatch(message, entry.question, entry.category)
    );

    if (matchedEntry) {
      return NextResponse.json({
        answer: matchedEntry.answer,
        type: 'trusted',
        source: 'knowledge_base',
        category: matchedEntry.category,
      });
    }

    // Step 2: Build dynamic prompt and try AI (if API key is configured)
    const dynamicPrompt = buildSystemPrompt(knowledgeBase);
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openaiKey) {
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: dynamicPrompt },
              { role: 'user', content: message },
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const answer = aiData.choices?.[0]?.message?.content;
          if (answer) {
            return NextResponse.json({ answer, type: 'ai', source: 'openai' });
          }
        }
      } catch (aiError) {
        console.error('OpenAI error:', aiError);
      }
    }

    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${dynamicPrompt}\n\nCustomer: ${message}` },
                  ],
                },
              ],
              generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const answer =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            return NextResponse.json({ answer, type: 'ai', source: 'gemini' });
          }
        }
      } catch (geminiError) {
        console.error('Gemini error:', geminiError);
      }
    }

    // Step 3: Smart hardcoded fallback
    const fallbackAnswer = getSmartFallback(message);
    return NextResponse.json({
      answer: fallbackAnswer,
      type: 'fallback',
      source: 'fallback',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        answer:
          "I'm having a moment! ✨ Please try again or contact us directly for assistance.",
        type: 'fallback',
        source: 'error',
      },
      { status: 200 }
    );
  }
}
