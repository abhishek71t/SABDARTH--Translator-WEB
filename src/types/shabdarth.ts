export type DetectedScript = 'hindi' | 'hinglish' | 'urdu' | 'english' | 'mixed';

export interface KeywordBreakdown {
  word: string;
  meaning: string;
  english?: string;
}

export interface ShabdarthResult {
  id?: string;
  query: string;
  isSentence: boolean;
  detectedLanguage: DetectedScript;
  original: string;
  normalized: string;
  simpleHindi: string;
  synonyms?: string[];
  englishMeanings?: string[];
  example?: string;
  wordType?: string;
  pronunciation?: string;
  // If sentence
  originalSentence?: string;
  keyWords?: KeywordBreakdown[];
  english?: string;
  timestamp?: number;
}

export interface WordOfTheDay {
  word: string;
  pronunciation: string;
  meaning: string;
  simpleHindi: string;
  synonyms: string[];
  englishMeanings: string[];
  example: string;
  quote?: string;
  themeTag: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  normalized: string;
  simpleHindi: string;
  isSentence: boolean;
  timestamp: number;
  result: ShabdarthResult;
  isFavorite?: boolean;
}

export interface FavoriteItem {
  id: string;
  word: string;
  normalized: string;
  simpleHindi: string;
  english?: string;
  synonyms?: string[];
  isSentence: boolean;
  addedAt: number;
  result: ShabdarthResult;
}
