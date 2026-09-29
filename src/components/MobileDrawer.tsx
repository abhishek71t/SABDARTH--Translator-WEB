import React from 'react';
import {
  X,
  Languages,
  Star,
  History,
  Keyboard,
  Moon,
  Sun,
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  onOpenHistory: () => void;
  historyCount: number;
  onToggleKeyboard: () => void;
  isKeyboardOpen: boolean;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFavorites,
  favoritesCount,
  onOpenHistory,
  historyCount,
  onToggleKeyboard,
  isKeyboardOpen,
}) => {
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-xs bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col justify-between z-10 border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-200">
        <div>
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0f172a]">
            <Logo size="sm" />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1.5">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>अनुवादक (Translator)</span>
              </div>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* Saved Favorites */}
            <button
              onClick={() => {
                onClose();
                onOpenFavorites();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>पसंदीदा शब्द (Favorites)</span>
              </div>
              {favoritesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Search History */}
            <button
              onClick={() => {
                onClose();
                onOpenHistory();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>खोज इतिहास (History)</span>
              </div>
              {historyCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Virtual Keyboard */}
            <button
              onClick={() => {
                onClose();
                onToggleKeyboard();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isKeyboardOpen
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Keyboard className="w-4 h-4" />
                <span>हिंदी कीबोर्ड (Virtual Keyboard)</span>
              </div>
              <span className="text-xs opacity-75">{isKeyboardOpen ? 'खुला है' : 'बंद'}</span>
            </button>
          </div>

          {/* Theme Settings Section (Fixed dark theme background box) */}
          <div className="p-3 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 block">
              थीम सेटिंग्स
            </span>

            {/* Dark / Light Mode Switch Container with dark:bg-slate-800 */}
            <div className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 transition-colors">
              <div className="flex items-center space-x-2.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>डार्क मोड (Dark Theme)</span>
              </div>

              <button
                onClick={toggleTheme}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <p className="font-medium text-slate-800 dark:text-slate-300 mb-1">
            हिंग्लिश से देवनागरी रूपांतरण
          </p>
          <p className="text-[11px] leading-relaxed">
            टाइप करें: <span className="font-mono text-blue-600 dark:text-blue-400">"namaste"</span> → स्वचालित रूप से <span className="font-medium text-slate-700 dark:text-slate-200">"नमस्ते"</span> में परिवर्तित होगा।
          </p>
        </div>
      </div>
    </div>
  );
};
