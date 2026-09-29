import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm';
  const textTitleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Soothing Geometric Bilingual Logo Emblem */}
      <div
        className={`${iconSize} relative rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 ring-1 ring-white/20`}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-bl-lg pointer-events-none" />

        {/* Bilingual Lettering: Devanagari 'अ' + 'A' */}
        <div className="flex items-center font-serif leading-none tracking-tight">
          <span className="text-[1.1em] font-semibold">अ</span>
          <span className="text-[0.8em] font-sans font-light opacity-80 -ml-0.5">A</span>
        </div>
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-baseline space-x-1.5">
          <span className={`${textTitleSize} font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans`}>
            शब्दार्थ
          </span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            Translate
          </span>
        </div>
      </div>
    </div>
  );
};
