import React, { useState } from 'react';
import { Menu, Sun, Moon, Keyboard, History, Star } from 'lucide-react';
import { Logo } from './Logo';
import { MobileDrawer } from './MobileDrawer';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onToggleKeyboard: () => void;
  isKeyboardOpen: boolean;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleKeyboard,
  isKeyboardOpen,
  onOpenHistory,
  historyCount,
  onOpenFavorites,
  favoritesCount,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Hamburger (Phone & Tablet) + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 select-none">
            {/* Hamburger Button for Mobile & Tablet */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              title="मेन्यू खोलें (Menu)"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div
              className="cursor-pointer transition-transform hover:opacity-95"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Logo size="md" />
            </div>
          </div>

          {/* Right: Controls, Favorites & Theme */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Favorites Star Button */}
            <button
              onClick={onOpenFavorites}
              className="relative px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 bg-slate-50 hover:bg-amber-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs"
              title="पसंदीदा शब्द (Saved Favorites)"
              aria-label="Saved Favorites"
            >
              <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">पसंदीदा</span>
              {favoritesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Virtual Keyboard Toggle */}
            <button
              onClick={onToggleKeyboard}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all border ${
                isKeyboardOpen
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="हिंदी कीबोर्ड (Devanagari Keyboard)"
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden md:inline">कीबोर्ड</span>
            </button>

            {/* Search History */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              title="खोज इतिहास (History)"
              aria-label="Search History"
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              {historyCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              title={theme === 'dark' ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile & Tablet Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onOpenFavorites={onOpenFavorites}
        favoritesCount={favoritesCount}
        onOpenHistory={onOpenHistory}
        historyCount={historyCount}
        onToggleKeyboard={onToggleKeyboard}
        isKeyboardOpen={isKeyboardOpen}
      />
    </>
  );
};
