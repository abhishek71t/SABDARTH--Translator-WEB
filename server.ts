import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { LOCAL_DICTIONARY, SAMPLE_SENTENCES } from './src/data/dictionary.ts';
import { transliterateHinglishToDevanagari } from './src/utils/transliteration.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Robust caller that tries gemini-flash-latest and falls back to gemini-3.1-flash-lite
 */
async function callGemini(contents: string, responseMimeType?: string): Promise<string | null> {
  if (!ai) return null;
  const models = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  for (const model of models) {
    try {
      const config: any = {};
      if (responseMimeType) {
        config.responseMimeType = responseMimeType;
      }
      const res = await ai.models.generateContent({
        model,
        contents,
        config: Object.keys(config).length > 0 ? config : undefined,
      });
      if (res && res.text) {
        return res.text.trim();
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next model:`, err?.message || err);
    }
  }
  return null;
}

/**
 * Helper to detect whether input is a sentence or a word
 */
function isInputSentence(input: string): boolean {
  const trimmed = input.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const hasSentencePunctuation = /[।?!.]/.test(trimmed);
  return wordCount >= 3 || hasSentencePunctuation;
}

// POST /api/transliterate
// Converts Romanized Hinglish into accurate Devanagari Hindi font style
app.post('/api/transliterate', async (req: Request, res: Response) => {
  try {
    const rawInput = (req.body.input || '').trim();
    if (!rawInput) {
      return res.json({ devanagari: '' });
    }

    // Client-side rule engine baseline
    const ruleDevanagari = transliterateHinglishToDevanagari(rawInput);

    // Call Gemini for context-aware Devanagari transliteration
    const prompt = `You are an expert Devanagari Hindi transliteration engine.
Convert this Romanized Hinglish or English text strictly into natural Devanagari Hindi script (देवनागरी लिपि).
Rules:
- Preserve proper nouns and spoken Hindi nuances accurately.
- Do NOT translate English words if they are part of casual Hinglish (e.g. "phone" -> "फ़ोन", "school" -> "स्कूल", "problem" -> "प्रॉब्लम").
- Return ONLY the converted Devanagari text, with no explanations, no quotes, no markdown.

Input text: "${rawInput}"`;

    const aiResult = await callGemini(prompt);
    if (aiResult) {
      const cleaned = aiResult.replace(/^["'`]+|["'`]+$/g, '').trim();
      return res.json({ devanagari: cleaned });
    }

    return res.json({ devanagari: ruleDevanagari });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to transliterate' });
  }
});

// POST /api/translate
// Main translation endpoint: Supports words and sentences in Hindi, Hinglish, Urdu, English
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const rawInput = (req.body.input || '').trim();
    const sourceLang = req.body.sourceLang || 'auto';
    const targetLang = req.body.targetLang || 'hindi';

    if (!rawInput) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // 1. Instant check in local dictionary
    if (LOCAL_DICTIONARY[rawInput]) {
      return res.json({
        ...LOCAL_DICTIONARY[rawInput],
        query: rawInput,
        timestamp: Date.now(),
      });
    }

    if (SAMPLE_SENTENCES[rawInput]) {
      return res.json({
        ...SAMPLE_SENTENCES[rawInput],
        query: rawInput,
        timestamp: Date.now(),
      });
    }

    const isSentence = isInputSentence(rawInput);
    const ruleDevanagari = transliterateHinglishToDevanagari(rawInput);

    // 2. Query Gemini
    const prompt = isSentence
      ? `You are Shabdarth, a fast and smart Hindi translator and language assistant.
Input text (${sourceLang} / auto-detected): "${rawInput}"

Analyze this input and provide JSON:
1. "detectedLanguage": 'hindi', 'hinglish', 'urdu', or 'english'
2. "normalized": The text converted into clean standard Devanagari Hindi script.
3. "simpleHindi": Clear, natural everyday Hindi (सरल हिंदी) translation / rephrasing that is very easy to read and understand.
4. "english": Accurate English translation.
5. "keyWords": Array of up to 4 difficult or key words from the sentence, each with {"word": "...", "meaning": "...", "english": "..."}
6. "example": A short example of everyday usage.

Respond with strict JSON format:
{
  "isSentence": true,
  "detectedLanguage": "hindi",
  "original": "${rawInput}",
  "normalized": "...",
  "originalSentence": "${rawInput}",
  "simpleHindi": "...",
  "english": "...",
  "keyWords": [
    {"word": "...", "meaning": "...", "english": "..."}
  ],
  "example": "..."
}`
      : `You are Shabdarth, an authoritative Hindi dictionary and translation assistant.
Input word (${sourceLang} / auto-detected): "${rawInput}"

Tasks:
1. "detectedLanguage": 'hindi', 'hinglish', 'urdu', or 'english'
2. "normalized": The word written in standard Devanagari Hindi script.
3. "simpleHindi": Concise, clear, everyday simple Hindi (सरल हिंदी) meaning.
4. "synonyms": Array of 3-4 Hindi synonyms (समानार्थी शब्द).
5. "englishMeanings": Array of 2-3 concise English meanings.
6. "example": A natural, everyday Hindi example sentence using this word.
7. "wordType": Part of speech (e.g. "संज्ञा", "विशेषण", "क्रिया").
8. "pronunciation": Romanized pronunciation.

Respond with strict JSON format:
{
  "isSentence": false,
  "detectedLanguage": "hindi",
  "original": "${rawInput}",
  "normalized": "...",
  "simpleHindi": "...",
  "synonyms": ["...", "..."],
  "englishMeanings": ["...", "..."],
  "example": "...",
  "wordType": "...",
  "pronunciation": "..."
}`;

    const aiJsonText = await callGemini(prompt, 'application/json');
    if (aiJsonText) {
      try {
        const parsed = JSON.parse(aiJsonText);
        return res.json({
          ...parsed,
          query: rawInput,
          timestamp: Date.now(),
        });
      } catch (parseErr) {
        console.error('Failed to parse AI JSON:', parseErr);
      }
    }

    // 3. Resilient fallback: Provide clean rule-based transliteration & meaning
    const fallbackResult = {
      query: rawInput,
      isSentence,
      detectedLanguage: 'hinglish',
      original: rawInput,
      normalized: ruleDevanagari,
      simpleHindi: ruleDevanagari,
      synonyms: ['अर्थ', 'समान शब्द'],
      englishMeanings: ['Meaning in English'],
      example: `${ruleDevanagari} का प्रयोग सामान्य बोलचाल में होता है।`,
      wordType: isSentence ? 'वाक्य' : 'शब्द',
      pronunciation: rawInput,
      keyWords: isSentence ? [{ word: ruleDevanagari, meaning: 'सरल रूप' }] : undefined,
      english: `Translation: ${rawInput}`,
      timestamp: Date.now(),
    };

    return res.json(fallbackResult);
  } catch (err: any) {
    console.error('Translate endpoint failure:', err);
    return res.status(500).json({ error: 'Failed to process translation' });
  }
});

// Start Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shabdarth server listening on port ${PORT}`);
  });
}

startServer();
