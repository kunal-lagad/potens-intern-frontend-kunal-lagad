import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import ActionQueue from './components/ActionQueue.jsx';
import LiveMetric from './components/LiveMetric.jsx';
import AnomalyPanel from './components/AnomalyPanel.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import { ACTION_ITEMS, STR } from './data.js';
import { playApproveSound, playHoldSound } from './utils/audio.js';


export default function App() {
  const [lang, setLang] = useState('en');
  const [isDark, setIsDark] = useState(false);
  const [lowBw, setLowBw] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [itemState, setItemState] = useState(() =>
    Object.fromEntries(ACTION_ITEMS.map(i => [i.id, 'open']))
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [highlightedAnomalyId, setHighlightedAnomalyId] = useState(null);
  const itemRefs = useRef([]);
  const anomalyRefs = useRef({});
  const t = STR[lang];

  const handleSelectAction = (idx) => {
    setFocusedIdx(idx);
    setPaletteOpen(false);
    // Wait for the palette to unmount before scrolling/focusing the target row.
    requestAnimationFrame(() => {
      const el = itemRefs.current[idx];
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
    });
  };

  const handleSelectAnomaly = (id) => {
    setPaletteOpen(false);
    setHighlightedAnomalyId(id);
    // The ref map is keyed by anomaly id so palette results can jump across panels.
    requestAnimationFrame(() => {
      anomalyRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    setTimeout(() => setHighlightedAnomalyId(null), 1800);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'hi';
  }, [lang]);

  useEffect(() => {
    document.body.classList.toggle('lowbw', lowBw);
  }, [lowBw]);

  // Load the custom typefaces only when low-bandwidth mode is off. If someone
  // enables low-bandwidth mode (or lands with it already on, once a preference
  // is wired up) the font request never happens — CSS falls back to system fonts.
  useEffect(() => {
    const FONT_LINK_ID = 'google-fonts-stylesheet';
    const existing = document.getElementById(FONT_LINK_ID);

    if (lowBw) {
      existing?.remove();
      return;
    }
    if (!existing) {
      const link = document.createElement('link');
      link.id = FONT_LINK_ID;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, [lowBw]);

  // Keyboard shortcuts: j/k navigate, a approve, h hold, Cmd/Ctrl+K opens the command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
        return;
      }
      if (paletteOpen) return; // palette owns arrow/enter/escape while it's open

      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setFocusedIdx(idx => {
          const next = Math.min(ACTION_ITEMS.length - 1, idx + 1);
          const el = itemRefs.current[next];
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus();
          return next;
        });
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setFocusedIdx(idx => {
          const next = Math.max(0, idx - 1);
          const el = itemRefs.current[next];
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus();
          return next;
        });
      } else if (e.key === 'a') {
        const id = ACTION_ITEMS[focusedIdx].id;
        if (!lowBw) playApproveSound();
        setItemState(prev => ({ ...prev, [id]: 'approved' }));
      } else if (e.key === 'h') {
        const id = ACTION_ITEMS[focusedIdx].id;
        if (!lowBw) playHoldSound();
        setItemState(prev => ({ ...prev, [id]: 'held' }));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusedIdx, paletteOpen, lowBw]);

  return (
    <div className="font-body bg-paper text-ink dark:bg-ink dark:text-paper-100 transition-colors duration-200 min-h-screen relative">
      {/* Ambient background glows for glassmorphism */}
      {!lowBw && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="hidden dark:block absolute -top-40 -left-20 w-96 h-96 bg-signal-teal/15 rounded-full blur-[100px]"></div>
          <div className="hidden dark:block absolute top-1/2 -right-20 w-80 h-80 bg-signal-amber/10 rounded-full blur-[120px]"></div>
        </div>
      )}

      <Header
        lang={lang} setLang={setLang}
        isDark={isDark} setIsDark={setIsDark}
        lowBw={lowBw} setLowBw={setLowBw}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <ActionQueue
            lang={lang}
            itemState={itemState}
            setItemState={setItemState}
            focusedIdx={focusedIdx}
            setFocusedIdx={setFocusedIdx}
            itemRefs={itemRefs}
            lowBw={lowBw}
          />

          <aside className="flex flex-col gap-6">
            <LiveMetric lang={lang} lowBw={lowBw} />
            <AnomalyPanel lang={lang} anomalyRefs={anomalyRefs} highlightedId={highlightedAnomalyId} lowBw={lowBw} />
          </aside>
        </div>

        <footer className="mt-8 pt-4 border-t border-ink/10 dark:border-paper-100/10 text-xs text-ink/40 dark:text-paper-100/40 font-mono decorative">
          {t.footerNote}
        </footer>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        lang={lang}
        onSelectAction={handleSelectAction}
        onSelectAnomaly={handleSelectAnomaly}
        lowBw={lowBw}
      />
    </div>
  );
}
