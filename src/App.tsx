import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { GoogleTranslator } from './components/GoogleTranslator';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { SearchHistoryModal } from './components/SearchHistoryModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ShabdarthResult, SearchHistoryItem, FavoriteItem } from './types/shabdarth';

function ShabdarthApp() {
  const { theme } = useTheme();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Search History in LocalStorage with Auto 3-Day Cleanup and Single-Letter Filter
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shabdarth_history');
        if (saved) {
          const parsed: SearchHistoryItem[] = JSON.parse(saved);
          const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
          // Clean single letters & items older than 3 days
          return parsed.filter(
            (item) => item.query && item.query.trim().length >= 2 && item.timestamp >= threeDaysAgo
          );
        }
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
    return [];
  });

  // Saved Favorites in LocalStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shabdarth_favorites');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    return [
      {
        id: 'fav-1',
        word: 'दुरुह',
        normalized: 'दुरुह',
        simpleHindi: 'कठिन या जिसे समझना बहुत मुश्किल हो',
        english: 'Difficult, Complex',
        synonyms: ['कठिन', 'जटिल', 'पेचीदा'],
        isSentence: false,
        addedAt: Date.now() - 86400000,
        result: {
          query: 'दुरुह',
          original: 'दुरुह',
          normalized: 'दुरुह',
          simpleHindi: 'कठिन या जिसे समझना बहुत मुश्किल हो',
          englishMeanings: ['Difficult', 'Complex'],
          synonyms: ['कठिन', 'जटिल', 'पेचीदा'],
          detectedLanguage: 'hindi',
          isSentence: false,
        },
      },
      {
        id: 'fav-2',
        word: 'संबल',
        normalized: 'संबल',
        simpleHindi: 'मुश्किल समय में मिलने वाला सहारा या आधार',
        english: 'Support, Sustenance',
        synonyms: ['सहारा', 'आश्रय', 'टेक'],
        isSentence: false,
        addedAt: Date.now() - 43200000,
        result: {
          query: 'संबल',
          original: 'संबल',
          normalized: 'संबल',
          simpleHindi: 'मुश्किल समय में मिलने वाला सहारा या आधार',
          englishMeanings: ['Support', 'Sustenance'],
          synonyms: ['सहारा', 'आश्रय', 'टेक'],
          detectedLanguage: 'hindi',
          isSentence: false,
        },
      },
    ];
  });

  // Sync and persist clean history
  useEffect(() => {
    try {
      localStorage.setItem('shabdarth_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save search history', e);
    }
  }, [history]);

  // Sync and persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('shabdarth_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  // Save to history: STAGE GATES: Avoid single letters and empty queries
  const handleSaveToHistory = (result: ShabdarthResult) => {
    const q = (result?.query || result?.original || '').trim();
    if (!q || q.length < 2) return; // Discard any single letter or blank

    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.query.trim().toLowerCase() !== q.toLowerCase()
      );
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: q,
        normalized: result.normalized || q,
        simpleHindi: result.simpleHindi,
        isSentence: result.isSentence,
        timestamp: Date.now(),
        result,
      };
      // Keep up to 30 items
      return [newItem, ...filtered].slice(0, 30);
    });
  };

  // Delete history older than 3 days
  const handleClearOlderThan3Days = () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    setHistory((prev) => prev.filter((item) => item.timestamp >= threeDaysAgo));
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('shabdarth_history');
    } catch (e) {}
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleFavorite = (result: ShabdarthResult) => {
    const key = (result.normalized || result.original || result.query).trim();
    if (!key) return;

    setFavorites((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.word.toLowerCase() === key.toLowerCase() ||
          item.normalized.toLowerCase() === key.toLowerCase()
      );

      if (existingIndex >= 0) {
        return prev.filter((_, idx) => idx !== existingIndex);
      } else {
        const newFav: FavoriteItem = {
          id: Date.now().toString(),
          word: key,
          normalized: result.normalized || key,
          simpleHindi: result.simpleHindi,
          english: result.english || (result.englishMeanings || []).join(', '),
          synonyms: result.synonyms,
          isSentence: result.isSentence,
          addedAt: Date.now(),
          result,
        };
        return [newFav, ...prev];
      }
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem('shabdarth_favorites');
    } catch (e) {}
  };

  const insertTextAtCursor = (char: string) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const val = textarea.value;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(textarea, val.slice(0, start) + char + val.slice(end));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }
  };

  const backspaceAtCursor = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const val = textarea.value;
    if (start === 0 && end === 0) return;

    const deleteFrom = start === end ? start - 1 : start;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(textarea, val.slice(0, deleteFrom) + val.slice(end));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
      textarea.setSelectionRange(deleteFrom, deleteFrom);
    }
  };

  const clearInput = () => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(textarea, '');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
    }
  };

  const loadTextIntoInput = (text: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
      }
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'soothing-fade-dark text-slate-100' : 'soothing-fade-light text-slate-900'
      } flex flex-col font-sans transition-colors duration-200`}
    >
      {/* Google Translate Style Minimalist Header with Responsive Hamburger Drawer */}
      <Header
        onToggleKeyboard={() => setIsKeyboardOpen((prev) => !prev)}
        isKeyboardOpen={isKeyboardOpen}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Translation Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <GoogleTranslator
          onOpenKeyboard={() => setIsKeyboardOpen(true)}
          onSaveToHistory={handleSaveToHistory}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
        />
      </main>

      {/* On-screen Devanagari Virtual Keyboard */}
      <VirtualKeyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onCharClick={insertTextAtCursor}
        onBackspace={backspaceAtCursor}
        onSpace={() => insertTextAtCursor(' ')}
        onClear={clearInput}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={(item) => loadTextIntoInput(item.normalized || item.word)}
        onRemoveFavorite={handleRemoveFavorite}
        onClearFavorites={handleClearFavorites}
      />

      {/* Search History Modal with Auto 3-Day Cleanup */}
      <SearchHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => loadTextIntoInput(item.query)}
        onClearHistory={handleClearHistory}
        onClearOlderThan3Days={handleClearOlderThan3Days}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* Clean Google Translate Style Soothing Minimal Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-3.5 text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">शब्दार्थ (Shabdarth Translate)</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">• सरल हिंदी व हिंग्लिश अनुवादक</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={() => setIsFavoritesOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              सहेजे गए पसंदीदा ({favorites.length})
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              इतिहास ({history.length})
            </button>
            <span>•</span>
            <span>3 दिन में स्वतः स्वच्छता</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ShabdarthApp />
    </ThemeProvider>
  );
}
