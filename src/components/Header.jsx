import { useEffect, useState } from 'react';
import { STR } from '../data.js';

export default function Header({ lang, setLang, isDark, setIsDark, lowBw, setLowBw, onOpenPalette }) {
  const [clock, setClock] = useState('--:--:--');
  const t = STR[lang];

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString(lang === 'en' ? 'en-IN' : 'hi-IN', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-ink/10 dark:border-paper-100/10">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">{t.title}</h1>
        <span className="hidden sm:inline text-xs font-mono uppercase tracking-widest text-ink/40 dark:text-paper-100/40">
          {t.subtitle}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink/15 dark:border-paper-100/20 text-sm text-ink/60 dark:text-paper-100/60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <span className="hidden md:inline">{lang === 'en' ? 'Jump to anything' : 'कहीं भी जाएं'}</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ink/10 dark:bg-paper-100/15">⌘K</kbd>
        </button>

        <div className="font-mono text-sm px-3 py-1.5 rounded-lg bg-ink/5 dark:bg-paper-100/10">{clock}</div>

        <div className="flex rounded-lg overflow-hidden border border-ink/15 dark:border-paper-100/20 text-sm font-medium" role="group" aria-label="Language">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 ${lang === 'en' ? 'bg-ink text-paper dark:bg-paper-100 dark:text-ink' : ''}`}
          >EN</button>
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1.5 ${lang === 'hi' ? 'bg-ink text-paper dark:bg-paper-100 dark:text-ink' : ''}`}
          >हि</button>
        </div>

        <button
          onClick={() => setIsDark(d => !d)}
          className="p-2 rounded-lg border border-ink/15 dark:border-paper-100/20"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {isDark ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></svg>
          )}
        </button>

        <button
          onClick={() => setLowBw(v => !v)}
          aria-pressed={lowBw}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink/15 dark:border-paper-100/20 text-sm font-medium ${lowBw ? 'bg-ink/10 dark:bg-paper-100/15' : ''}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 8.82a15 15 0 0120 0M5 12.86a10 10 0 0114 0M8.5 16.9a5 5 0 017 0" /><path d="M12 20h.01" strokeWidth="3" /></svg>
          <span>{t.lowbw}</span>
        </button>
      </div>
    </header>
  );
}
