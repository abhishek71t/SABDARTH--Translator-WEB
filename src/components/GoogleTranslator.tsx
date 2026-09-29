import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftRight,
  Volume2,
  Copy,
  Check,
  Share2,
  X,
  Keyboard,
  Star,
  Loader2,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ShabdarthResult, FavoriteItem } from '../types/shabdarth';
import { speakText } from '../utils/speech';
import { transliterateHinglishToDevanagari, detectScript } from '../utils/transliteration';

interface GoogleTranslatorProps {
  onOpenKeyboard: () => void;
  onSaveToHistory: (result: ShabdarthResult) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (result: ShabdarthResult) => void;
  onOpenFavorites: () => void;
}

export const GoogleTranslator: React.FC<GoogleTranslatorProps> = ({
  onOpenKeyboard,
  onSaveToHistory,
  favorites,
  onToggleFavorite,
  onOpenFavorites,
}) => {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState<'auto' | 'hinglish' | 'english' | 'hindi' | 'urdu'>('auto');
  const [targetTab, setTargetTab] = useState<'hindi' | 'simple_hindi' | 'english'>('hindi');

  const [translationResult, setTranslationResult] = useState<ShabdarthResult | null>(null);
  const [devanagariConverted, setDevanagariConverted] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveTranslation, setLiveTranslation] = useState(true);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current translation is in favorites
  const isCurrentFavorite = Boolean(
    translationResult &&
      favorites.some(
        (f) =>
          f.word.toLowerCase() === (translationResult.normalized || translationResult.original).toLowerCase() ||
          f.normalized.toLowerCase() === (translationResult.normalized || translationResult.original).toLowerCase()
      )
  );

  // When input changes, update phonetic Devanagari preview instantly
  useEffect(() => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setDevanagariConverted('');
      setTranslationResult(null);
      return;
    }

    // Never translate single characters live to avoid spamming
    const script = detectScript(trimmed);
    if (script === 'hinglish' || sourceLang === 'hinglish') {
      const converted = transliterateHinglishToDevanagari(trimmed);
      setDevanagariConverted(converted);
    } else {
      setDevanagariConverted(trimmed);
    }

    // Only live-translate if input is at least 2 characters
    if (liveTranslation && trimmed.length >= 2) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        executeTranslation(trimmed, false);
      }, 550);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputText, sourceLang, liveTranslation]);

  // Main translation execution function
  const executeTranslation = async (textToTranslate?: string, saveHistory = true) => {
    const query = (textToTranslate !== undefined ? textToTranslate : inputText).trim();
    // Strictly avoid single characters
    if (!query || query.length < 2) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: query,
          sourceLang,
          targetLang: targetTab,
        }),
      });

      if (res.ok) {
        const data: ShabdarthResult = await res.json();
        setTranslationResult(data);
        if (data.normalized) {
          setDevanagariConverted(data.normalized);
        }
        // Only save meaningful words (>= 2 chars) to history
        if (saveHistory && query.length >= 2) {
          onSaveToHistory(data);
        }
      }
    } catch (err) {
      console.error('Translation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert input in-place into Devanagari font style
  const handleConvertInPlace = () => {
    const converted = transliterateHinglishToDevanagari(inputText);
    setInputText(converted);
    setDevanagariConverted(converted);
    if (converted.trim().length >= 2) {
      executeTranslation(converted, true);
    }
  };

  const handleClear = () => {
    setInputText('');
    setDevanagariConverted('');
    setTranslationResult(null);
  };

  const handleSwap = () => {
    if (translationResult?.simpleHindi || devanagariConverted) {
      const newQuery = translationResult?.simpleHindi || devanagariConverted;
      setInputText(newQuery);
      if (newQuery.trim().length >= 2) {
        executeTranslation(newQuery, true);
      }
    }
  };

  const handleSpeak = (textToSpeak: string) => {
    if (!textToSpeak) return;
    setIsPlayingAudio(true);
    speakText(textToSpeak, {
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleCopy = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine what to display in right box
  const getOutputText = () => {
    if (!inputText.trim()) return '';
    if (isLoading && !translationResult && !devanagariConverted) return '';

    if (targetTab === 'hindi') {
      return translationResult?.normalized || devanagariConverted || translationResult?.simpleHindi || '';
    }
    if (targetTab === 'simple_hindi') {
      return translationResult?.simpleHindi || devanagariConverted || '';
    }
    if (targetTab === 'english') {
      return translationResult?.english || (translationResult?.englishMeanings || []).join(', ') || '';
    }
    return translationResult?.simpleHindi || devanagariConverted || '';
  };

  const outputText = getOutputText();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3">
      {/* Top Action Pills */}
      <div className="flex items-center justify-between pb-0.5 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          {/* Text Mode */}
          <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center space-x-1.5 border border-blue-200/60 dark:border-blue-900/60 shadow-2xs">
            <FileText className="w-3.5 h-3.5" />
            <span>अनुवाद (Text)</span>
          </div>

          {/* Quick Hinglish to Devanagari in-place converter */}
          <button
            onClick={handleConvertInPlace}
            disabled={!inputText.trim()}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500/60 dark:hover:text-blue-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shadow-2xs active:scale-95"
            title="हिंग्लिश शब्दों को देवनागरी लिपि में बदलें"
          >
            <span className="font-bold text-blue-600 dark:text-blue-400">Aa → क</span>
            <span>देवनागरी में बदलें</span>
          </button>

          {/* Quick View Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center space-x-1.5 shadow-2xs active:scale-95"
            title="पसंदीदा शब्द देखें"
          >
            <Star className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            <span>पसंदीदा ({favorites.length})</span>
          </button>
        </div>

        {/* Live Translation Toggle */}
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 select-none">
          <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            Live Translation
          </span>
          <button
            onClick={() => setLiveTranslation(!liveTranslation)}
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
              liveTranslation ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            aria-label="Toggle Live Translation"
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                liveTranslation ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Translator Card - COMPACT HEIGHT SO BOTH BOXES ARE VISIBLE */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
        {/* Language Tabs Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700 text-xs select-none">
          {/* Left: Source Language Tabs */}
          <div className="px-4 py-2.5 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setSourceLang('auto')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  sourceLang === 'auto'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Detect language
              </button>

              <button
                onClick={() => setSourceLang('hinglish')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  sourceLang === 'hinglish'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Hinglish
              </button>

              <button
                onClick={() => setSourceLang('english')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  sourceLang === 'english'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                English
              </button>

              <button
                onClick={() => setSourceLang('hindi')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  sourceLang === 'hindi'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Hindi
              </button>

              <button
                onClick={() => setSourceLang('urdu')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  sourceLang === 'urdu'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Urdu
              </button>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1"
              title="भाषाएं बदलें (Swap languages)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Target Language Tabs */}
          <div className="px-4 py-2.5 flex items-center justify-between overflow-x-auto bg-slate-50/70 dark:bg-[#151f32]">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setTargetTab('hindi')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  targetTab === 'hindi'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Hindi (हिंदी)
              </button>

              <button
                onClick={() => setTargetTab('simple_hindi')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  targetTab === 'simple_hindi'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                सरल हिंदी
              </button>

              <button
                onClick={() => setTargetTab('english')}
                className={`pb-0.5 font-medium transition-colors border-b-2 ${
                  targetTab === 'english'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>

            {isLoading && (
              <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[11px]">Translating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Translation Body: Compact Symmetrical Panes */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700 min-h-[140px] sm:min-h-[160px]">
          {/* Left Pane: Input Text Area (Compact) */}
          <div className="flex flex-col p-4 bg-white dark:bg-[#1e293b] justify-between">
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputText.trim().length >= 2) {
                      executeTranslation(inputText, true);
                    }
                  }
                }}
                placeholder="हिंग्लिश, हिंदी या अंग्रेजी शब्द अथवा वाक्य लिखें... (e.g. namaste, duruuh, kitab)"
                className="w-full min-h-[110px] sm:min-h-[130px] bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg font-light focus:outline-none resize-none leading-relaxed"
                autoFocus
              />
            </div>

            {/* Left Bottom Toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenKeyboard}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="हिंदी कीबोर्ड (Devanagari Virtual Keyboard)"
                >
                  <Keyboard className="w-4 h-4" />
                </button>

                {inputText.trim() && (
                  <button
                    onClick={() => handleSpeak(inputText)}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      isPlayingAudio ? 'text-blue-600 animate-pulse' : 'text-slate-600 dark:text-slate-300'
                    }`}
                    title="सुनें (Listen)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-slate-400">
                  {inputText.length} / 5000
                </span>

                {inputText && (
                  <button
                    onClick={handleClear}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="साफ करें"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane: Translation Output (Compact) */}
          <div className="flex flex-col p-4 bg-slate-50/70 dark:bg-[#151f32] justify-between">
            <div className="flex-1 overflow-y-auto">
              {outputText ? (
                <div>
                  <p className="text-base sm:text-lg font-light text-slate-900 dark:text-slate-100 leading-relaxed font-sans select-all">
                    {outputText}
                  </p>

                  {/* Devanagari normalized indicator if different */}
                  {targetTab !== 'hindi' && devanagariConverted && devanagariConverted !== outputText && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      देवनागरी रूप: <span className="font-semibold text-slate-700 dark:text-slate-300">{devanagariConverted}</span>
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-slate-400 dark:text-slate-500 text-base sm:text-lg font-light">
                  {isLoading ? 'Translating...' : 'Translation'}
                </span>
              )}
            </div>

            {/* Right Bottom Toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                {outputText && (
                  <button
                    onClick={() => handleSpeak(outputText)}
                    className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
                      isPlayingAudio ? 'text-blue-600 animate-pulse' : 'text-slate-600 dark:text-slate-300'
                    }`}
                    title="उच्चारण सुनें (Listen)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1">
                {outputText && (
                  <>
                    {/* Favorite Star Button */}
                    <button
                      onClick={() => {
                        if (translationResult) {
                          onToggleFavorite(translationResult);
                        } else if (outputText) {
                          onToggleFavorite({
                            query: inputText,
                            original: inputText,
                            normalized: devanagariConverted || outputText,
                            simpleHindi: outputText,
                            detectedLanguage: 'hindi',
                            isSentence: outputText.split(' ').length > 3,
                          });
                        }
                      }}
                      className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ${
                        isCurrentFavorite
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-500 hover:text-amber-500'
                      }`}
                      title={isCurrentFavorite ? 'पसंदीदा से हटाएं' : 'पसंदीदा में जोड़ें'}
                      aria-label="Toggle Favorite"
                    >
                      <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopy(outputText)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="कॉपी करें"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={async () => {
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: 'Shabdarth Translation',
                              text: outputText,
                            });
                          } catch (e) {}
                        } else {
                          handleCopy(outputText);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="शेयर करें"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSLATE BUTTON IN THE MIDDLE WITH VIBRANT SOOTHING GRADIENT */}
      <div className="flex items-center justify-center pt-1 pb-1">
        <button
          onClick={() => {
            if (inputText.trim().length >= 2) {
              executeTranslation(inputText, true);
            }
          }}
          disabled={isLoading || inputText.trim().length < 2}
          className="group relative px-7 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2.5 overflow-hidden"
        >
          {/* Subtle gradient shine animation */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>अनुवाद हो रहा है...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Translate (अनुवाद करें)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Minimalist Definitions & Synonyms Card */}
      {translationResult && (translationResult.simpleHindi || (translationResult.synonyms && translationResult.synonyms.length > 0)) && (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3.5 text-sm animate-in fade-in">
          {/* Word Heading */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline space-x-3">
              <span className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
                {translationResult.normalized || translationResult.original}
              </span>
              {translationResult.pronunciation && (
                <span className="text-xs text-slate-400 italic">/{translationResult.pronunciation}/</span>
              )}
              {translationResult.wordType && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {translationResult.wordType}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(translationResult)}
                className={`p-1.5 rounded-lg border transition-colors flex items-center space-x-1 text-xs ${
                  isCurrentFavorite
                    ? 'border-amber-400/80 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-amber-500'
                }`}
                title={isCurrentFavorite ? 'पसंदीदा से हटाएं' : 'पसंदीदा में सहेजें'}
              >
                <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span>{isCurrentFavorite ? 'सहेजा गया' : 'पसंदीदा'}</span>
              </button>

              <button
                onClick={() => handleSpeak(`${translationResult.normalized || translationResult.original}। ${translationResult.simpleHindi}`)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium ml-2"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>उच्चारण</span>
              </button>
            </div>
          </div>

          {/* Simple Hindi Definition */}
          {translationResult.simpleHindi && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                सरल अर्थ (Simple Meaning)
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200">
                {translationResult.simpleHindi}
              </p>
            </div>
          )}

          {/* Synonyms */}
          {translationResult.synonyms && translationResult.synonyms.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                समानार्थी शब्द (Synonyms)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {translationResult.synonyms.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputText(s);
                      executeTranslation(s, true);
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 text-slate-800 dark:text-slate-200 text-xs transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Words if sentence */}
          {translationResult.keyWords && translationResult.keyWords.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                कठिन शब्द व सरल अर्थ (Key Terms)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {translationResult.keyWords.map((kw, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setInputText(kw.word);
                      executeTranslation(kw.word, true);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{kw.word}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-2">→ {kw.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example Sentence */}
          {translationResult.example && (
            <div className="pt-1.5 text-xs text-slate-600 dark:text-slate-400 italic">
              <span className="font-semibold text-slate-700 dark:text-slate-300 not-italic block mb-0.5">
                उदाहरण वाक्य:
              </span>
              "{translationResult.example}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
