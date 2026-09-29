import React, { useState } from 'react';
import { X, Delete, Space, Eraser, Sparkles } from 'lucide-react';

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onCharClick: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  isOpen,
  onClose,
  onCharClick,
  onBackspace,
  onSpace,
  onClear,
}) => {
  // Default to merged 'all' view so consonants and matras are immediately accessible together
  const [activeTab, setActiveTab] = useState<'merged' | 'vowels' | 'numbers'>('merged');

  if (!isOpen) return null;

  const MATRAS = [
    { char: 'ा', label: 'ा' },
    { char: 'ि', label: 'ि' },
    { char: 'ी', label: 'ी' },
    { char: 'ु', label: 'ु' },
    { char: 'ू', label: 'ू' },
    { char: 'ृ', label: 'ृ' },
    { char: 'े', label: 'े' },
    { char: 'ै', label: 'ै' },
    { char: 'ो', label: 'ो' },
    { char: 'ौ', label: 'ौ' },
    { char: 'ं', label: 'ं' },
    { char: 'ँ', label: 'ँ' },
    { char: 'ः', label: 'ः' },
    { char: '्', label: '् (हलंत)' },
    { char: '़', label: '़ (नुक्ता)' },
  ];

  const CONSONANTS = [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व',
    'श', 'ष', 'स', 'ह',
    'क्ष', 'त्र', 'ज्ञ', 'श्र',
    'ड़', 'ढ़', 'फ़', 'ज़'
  ];

  const VOWELS = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];

  const NUMBERS_PUNCTUATION = [
    '०', '१', '२', '३', '४', '५', '६', '७', '८', '९',
    '।', '॥', '?', '!', ',', '-', '(', ')', '"', '"',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-200 p-2 sm:p-4 max-w-4xl mx-auto rounded-t-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>हिंदी कीबोर्ड</span>
          </span>

          <button
            onClick={() => setActiveTab('merged')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'merged'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>व्यंजन + मात्राएँ (संयुक्त)</span>
          </button>

          <button
            onClick={() => setActiveTab('vowels')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'vowels'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            स्वर
          </button>

          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'numbers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            अंक/चिह्न
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close keyboard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Keys Container */}
      <div className="max-h-56 sm:max-h-64 overflow-y-auto py-1 space-y-2">
        {/* Merged View: Consonants + Matras together */}
        {activeTab === 'merged' && (
          <div className="space-y-2">
            {/* Dedicated Matras Strip (Always visible directly with Consonants) */}
            <div className="p-1.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-900/60">
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-700 dark:text-blue-300 px-1 mb-1">
                <span>मात्राएँ (सीधे लगाएं):</span>
                <span className="text-[10px] text-blue-500/80 font-normal">व्यंजन के बाद मात्रा पर टैप करें</span>
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-15 gap-1 sm:gap-1.5">
                {MATRAS.map((item) => (
                  <button
                    key={item.char}
                    onClick={() => onCharClick(item.char)}
                    className="h-8 sm:h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-base sm:text-lg font-bold border border-blue-200 dark:border-slate-700 active:scale-95 transition-all flex items-center justify-center shadow-2xs"
                    title={item.label}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            </div>

            {/* Consonants (व्यंजन) Grid */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 mb-1">
                व्यंजन (Consonants):
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 sm:gap-1.5">
                {CONSONANTS.map((char) => (
                  <button
                    key={char}
                    onClick={() => onCharClick(char)}
                    className="h-9 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-slate-800 dark:text-slate-100 text-base sm:text-lg font-medium border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform flex items-center justify-center shadow-2xs"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vowels Only View */}
        {activeTab === 'vowels' && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
              स्वर वर्ण (Vowels):
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-2">
              {VOWELS.map((char) => (
                <button
                  key={char}
                  onClick={() => onCharClick(char)}
                  className="h-10 sm:h-11 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 text-slate-800 dark:text-slate-100 text-lg font-medium border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform flex items-center justify-center shadow-2xs"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Numbers & Punctuation View */}
        {activeTab === 'numbers' && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
              अंक और विराम चिह्न (Numbers & Symbols):
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {NUMBERS_PUNCTUATION.map((char, idx) => (
                <button
                  key={`${char}-${idx}`}
                  onClick={() => onCharClick(char)}
                  className="h-10 sm:h-11 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-base sm:text-lg font-medium border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform flex items-center justify-center shadow-2xs"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Actions Row (Space, Backspace, Clear) */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onClear}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors active:scale-95"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">मिटाएं (Clear)</span>
        </button>

        <button
          onClick={onSpace}
          className="flex-1 max-w-sm h-9 sm:h-10 rounded-xl bg-slate-200 dark:bg-slate-750 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-300 dark:border-slate-650 flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-2xs"
        >
          <Space className="w-4 h-4" />
          <span>Space (स्थान)</span>
        </button>

        <button
          onClick={onBackspace}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Delete className="w-4 h-4" />
          <span className="hidden sm:inline">हटाएं</span>
        </button>
      </div>
    </div>
  );
};
