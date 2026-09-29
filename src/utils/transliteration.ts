import { DetectedScript } from '../types/shabdarth';

// Regex ranges
const DEVANAGARI_REGEX = /[\u0900-\u097F]/;
const URDU_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_REGEX = /[a-zA-Z]/;

export function detectScript(input: string): DetectedScript {
  if (!input || !input.trim()) return 'hindi';

  const text = input.trim();
  const hasDevanagari = DEVANAGARI_REGEX.test(text);
  const hasUrdu = URDU_REGEX.test(text);
  const hasLatin = LATIN_REGEX.test(text);

  if (hasUrdu) return 'urdu';
  if (hasDevanagari && !hasLatin) return 'hindi';
  if (hasLatin && !hasDevanagari) return 'hinglish';
  if (hasDevanagari && hasLatin) return 'mixed';

  return 'hindi';
}

// Common whole-word dictionary for common Hinglish vocabulary
const HINGLISH_DICTIONARY: Record<string, string> = {
  'namaste': 'नमस्ते',
  'namaskar': 'नमस्कार',
  'kiran': 'किरण',
  'sharma': 'शर्मा',
  'aap': 'आप',
  'kaise': 'कैसे',
  'kaisa': 'कैसा',
  'kaisi': 'कैसी',
  'ho': 'हो',
  'hai': 'है',
  'hain': 'हैं',
  'hoon': 'हूँ',
  'hun': 'हूँ',
  'kya': 'क्या',
  'kyon': 'क्यों',
  'kyun': 'क्यों',
  'kab': 'कब',
  'kahan': 'कहाँ',
  'kaun': 'कौन',
  'main': 'मैं',
  'mai': 'मैं',
  'meh': 'मैं',
  'mujhe': 'मुझे',
  'mera': 'मेरा',
  'meri': 'मेरी',
  'mere': 'मेरे',
  'hum': 'हम',
  'hamara': 'हमारा',
  'tum': 'तुम',
  'tumhara': 'तुम्हारा',
  'iska': 'इसका',
  'uski': 'उसकी',
  'uska': 'उसका',
  'uske': 'उसके',
  'matlab': 'मतलब',
  'arth': 'अर्थ',
  'shabd': 'शब्द',
  'shabdarth': 'शब्दार्थ',
  'batao': 'बताओ',
  'bataiye': 'बताइए',
  'boliye': 'बोलिए',
  'karo': 'करो',
  'karna': 'करना',
  'karni': 'करनी',
  'jaana': 'जाना',
  'aana': 'आना',
  'aaj': 'आज',
  'kal': 'कल',
  'parson': 'परसों',
  'duruuh': 'दुरुह',
  'duruh': 'दुरुह',
  'kathin': 'कठिन',
  'mushkil': 'मुश्किल',
  'saral': 'सरल',
  'aasan': 'आसान',
  'vaktavya': 'वक्तव्य',
  'sambal': 'संबल',
  'jigyasa': 'जिज्ञासा',
  'prabhavshali': 'प्रभावशाली',
  'accha': 'अच्छा',
  'achha': 'अच्छा',
  'bahut': 'बहुत',
  'zindagi': 'जिंदगी',
  'kitab': 'किताब',
  'kitaab': 'किताब',
  'school': 'स्कूल',
  'padhai': 'पढ़ाई',
  'bazaar': 'बाजार',
  'bazar': 'बाजार',
  'shukriya': 'शुक्रिया',
  'dhanyawad': 'धन्यवाद',
  'dhanyavad': 'धन्यवाद',
  'khoob': 'खूब',
  'sundar': 'सुंदर',
  'prem': 'प्रेम',
  'pyaar': 'प्यार',
  'dost': 'दोस्त',
  'mitra': 'मित्र',
  'bhai': 'भाई',
  'behen': 'बहन',
  'baat': 'बात',
  'samay': 'समय',
  'desh': 'देश',
  'bharat': 'भारत',
  'hindustan': 'हिंदुस्तान',
  'hindi': 'हिंदी'
};

// Phonetic mapping for characters and syllables
const VOWELS_INITIAL: Record<string, string> = {
  'aa': 'आ', 'a': 'अ', 'ai': 'ऐ', 'au': 'औ', 'ee': 'ई', 'i': 'इ',
  'oo': 'ऊ', 'u': 'उ', 'e': 'ए', 'o': 'ओ', 'ri': 'ऋ'
};

const MATRAS_MAP: Record<string, string> = {
  'aa': 'ा', 'a': '', 'ai': 'ै', 'au': 'ौ', 'ee': 'ी', 'i': 'ि',
  'oo': 'ू', 'u': 'ु', 'e': 'े', 'o': 'ो'
};

const CONSONANTS_MAP: Record<string, string> = {
  'kh': 'ख', 'gh': 'घ', 'ch': 'च', 'chh': 'छ', 'jh': 'झ',
  'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ', 'sh': 'श',
  'shh': 'ष', 'gy': 'ज्ञ', 'tr': 'त्र', 'k': 'क', 'g': 'ग',
  'j': 'ज', 't': 'त', 'd': 'द', 'n': 'न', 'p': 'प', 'b': 'ब',
  'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
  's': 'स', 'h': 'ह', 'z': 'ज़', 'f': 'फ़', 'q': 'क़', 'x': 'क्स'
};

/**
 * Phonetically converts a single Romanized word to Devanagari
 */
export function transliterateWordPhonetic(rawWord: string): string {
  if (!rawWord) return '';
  const lower = rawWord.toLowerCase();

  // 1. Direct dictionary check
  if (HINGLISH_DICTIONARY[lower]) {
    return HINGLISH_DICTIONARY[lower];
  }

  // Preserve non-alphabet characters
  if (!/^[a-z]+$/.test(lower)) {
    return rawWord;
  }

  let result = '';
  let i = 0;
  const n = lower.length;

  while (i < n) {
    // Check initial vowel if at start of syllable or word
    if (i === 0) {
      if (i + 2 <= n && VOWELS_INITIAL[lower.substring(i, i + 2)]) {
        result += VOWELS_INITIAL[lower.substring(i, i + 2)];
        i += 2;
        continue;
      }
      if (VOWELS_INITIAL[lower[i]]) {
        result += VOWELS_INITIAL[lower[i]];
        i += 1;
        continue;
      }
    }

    // Try matching 3-letter consonant (e.g. chh, shh)
    let consonant = '';
    let consLen = 0;
    if (i + 3 <= n && CONSONANTS_MAP[lower.substring(i, i + 3)]) {
      consonant = CONSONANTS_MAP[lower.substring(i, i + 3)];
      consLen = 3;
    } else if (i + 2 <= n && CONSONANTS_MAP[lower.substring(i, i + 2)]) {
      consonant = CONSONANTS_MAP[lower.substring(i, i + 2)];
      consLen = 2;
    } else if (CONSONANTS_MAP[lower[i]]) {
      consonant = CONSONANTS_MAP[lower[i]];
      consLen = 1;
    }

    if (consonant) {
      i += consLen;
      // Look ahead for following vowel/matra
      let matra = '';
      let vowelLen = 0;

      if (i + 2 <= n && MATRAS_MAP[lower.substring(i, i + 2)] !== undefined) {
        matra = MATRAS_MAP[lower.substring(i, i + 2)];
        vowelLen = 2;
      } else if (i < n && MATRAS_MAP[lower[i]] !== undefined) {
        matra = MATRAS_MAP[lower[i]];
        vowelLen = 1;
      }

      if (vowelLen > 0) {
        result += consonant + matra;
        i += vowelLen;
      } else {
        // If at end of word, Hindi words usually drop inherent 'a' halant, but if mid-word without vowel, add halant
        if (i < n && !/[aeiou]/.test(lower[i])) {
          result += consonant + '्';
        } else {
          result += consonant;
        }
      }
      continue;
    }

    // Single vowel mid-word
    if (i + 2 <= n && VOWELS_INITIAL[lower.substring(i, i + 2)]) {
      result += VOWELS_INITIAL[lower.substring(i, i + 2)];
      i += 2;
      continue;
    }
    if (VOWELS_INITIAL[lower[i]]) {
      result += VOWELS_INITIAL[lower[i]];
      i += 1;
      continue;
    }

    // Fallback single character
    result += lower[i];
    i++;
  }

  return result;
}

/**
 * Transliterates full Hinglish text into Devanagari font style
 */
export function transliterateHinglishToDevanagari(text: string): string {
  if (!text) return '';
  return text.replace(/[a-zA-Z]+/g, (match) => {
    return transliterateWordPhonetic(match);
  });
}
