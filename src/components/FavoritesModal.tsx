import React, { useState } from 'react';
import { Star, X, Trash2, Search, Volume2, ArrowRight, BookOpen, FileText, Copy, Check } from 'lucide-react';
import { FavoriteItem } from '../types/shabdarth';
import { speakText } from '../utils/speech';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  onSelectFavorite: (item: FavoriteItem) => void;
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  onClearFavorites,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'words' | 'sentences'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter((item) => {
    const matchesQuery =
      item.word.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.normalized.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.simpleHindi.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (item.english && item.english.toLowerCase().includes(filterQuery.toLowerCase()));

    if (!matchesQuery) return false;
    if (filterType === 'words') return !item.isSentence;
    if (filterType === 'sentences') return item.isSentence;
    return true;
  });

  const handleSpeak = (item: FavoriteItem) => {
    setPlayingId(item.id);
    speakText(`${item.normalized || item.word}। ${item.simpleHindi}`, {
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const handleCopy = (item: FavoriteItem) => {
    const text = `${item.normalized || item.word}: ${item.simpleHindi}${item.english ? ` (${item.english})` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>पसंदीदा शब्द (Saved Favorites)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  {favorites.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                दैनिक अभ्यास और बाद में उपयोग के लिए सहेजे गए शब्द
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        {favorites.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="पसंदीदा में खोजें..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1 text-xs self-start sm:self-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white font-medium shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                सभी ({favorites.length})
              </button>
              <button
                onClick={() => setFilterType('words')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'words'
                    ? 'bg-blue-600 text-white font-medium shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                शब्द ({favorites.filter((f) => !f.isSentence).length})
              </button>
              <button
                onClick={() => setFilterType('sentences')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterType === 'sentences'
                    ? 'bg-blue-600 text-white font-medium shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                वाक्य ({favorites.filter((f) => f.isSentence).length})
              </button>
            </div>
          </div>
        )}

        {/* Favorites List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredFavorites.length === 0 ? (
            <div className="py-14 text-center text-slate-400 dark:text-slate-500">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-500">
                <Star className="w-6 h-6 stroke-1" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {filterQuery ? 'कोई परिणाम नहीं मिला' : 'कोई पसंदीदा शब्द सहेजा नहीं गया है'}
              </p>
              <p className="text-xs mt-1 text-slate-400 max-w-sm mx-auto">
                अनुवादक में किसी भी शब्द के पास स्टार (★) आइकन पर क्लिक करके उसे यहाँ सुरक्षित करें।
              </p>
            </div>
          ) : (
            filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/60 bg-white dark:bg-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1.5 flex-wrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                          item.isSentence
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                        }`}
                      >
                        {item.isSentence ? <FileText className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
                        {item.isSentence ? 'वाक्य' : 'शब्द'}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {new Date(item.addedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Word in Devanagari */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                      {item.normalized || item.word}
                    </h3>

                    {/* Simple Hindi meaning */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">सरल अर्थ: </span>
                      {item.simpleHindi}
                    </p>

                    {/* English meaning if available */}
                    {item.english && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-medium">English: </span>
                        {item.english}
                      </p>
                    )}

                    {/* Synonyms pills */}
                    {item.synonyms && item.synonyms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.synonyms.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions on favorite item */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        playingId === item.id ? 'text-blue-600 animate-pulse' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title="उच्चारण सुनें (Listen)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="कॉपी करें"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onRemoveFavorite(item.id)}
                      className="p-1.5 rounded-lg text-amber-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="पसंदीदा से हटाएं"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Open in Translator Button */}
                <button
                  onClick={() => {
                    onSelectFavorite(item);
                    onClose();
                  }}
                  className="mt-1 w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-slate-700/60 dark:hover:bg-blue-950/40 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 text-xs font-medium border border-slate-200/80 dark:border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>अनुवादक में खोलें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              कुल {favorites.length} शब्द सहेजे गए
            </span>
            <button
              onClick={onClearFavorites}
              className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              सभी पसंदीदा हटाएं (Clear All)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
