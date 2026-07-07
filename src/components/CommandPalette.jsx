import { useEffect, useMemo, useRef, useState } from 'react';
import { ACTION_ITEMS, ANOMALIES, STR, PRIORITY_STYLE, SEVERITY_STYLE } from '../data.js';

export default function CommandPalette({ open, onClose, lang, onSelectAction, onSelectAnomaly, lowBw }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const t = STR[lang];

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const actionResults = ACTION_ITEMS
      .map((item, idx) => ({ type: 'action', idx, item }))
      .filter(({ item }) => {
        if (!q) return true;
        const tt = item[lang];
        return (
          tt.title.toLowerCase().includes(q) ||
          tt.context.toLowerCase().includes(q) ||
          tt.owner.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      });

    const anomalyResults = ANOMALIES
      .map(a => ({ type: 'anomaly', anomaly: a }))
      .filter(({ anomaly }) => {
        if (!q) return true;
        const sys = (lang === 'en' ? anomaly.sysEn : anomaly.sysHi).toLowerCase();
        const desc = (lang === 'en' ? anomaly.descEn : anomaly.descHi).toLowerCase();
        return sys.includes(q) || desc.includes(q);
      });

    return [...actionResults, ...anomalyResults];
  }, [query, lang]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(results.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[activeIndex];
        if (!r) return;
        if (r.type === 'action') onSelectAction(r.idx);
        else onSelectAnomaly(r.anomaly.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, activeIndex, onSelectAction, onSelectAnomaly, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 ${lowBw ? 'bg-ink/50 backdrop-blur-sm' : 'bg-ink/30 dark:bg-[#000000]/40 backdrop-blur-md'}`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-soft overflow-hidden ${lowBw ? 'bg-paper-100 dark:bg-ink-50 border border-ink/10 dark:border-paper-100/15' : 'bg-paper-100 dark:bg-white/[0.05] dark:backdrop-blur-3xl border border-ink/10 dark:border-white/[0.1] shadow-2xl'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ink/10 dark:border-paper-100/15">
          <svg className="w-4 h-4 text-ink/40 dark:text-paper-100/40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Jump to an item or anomaly…' : 'किसी आइटम या विसंगति पर जाएं…'}
            className="flex-1 bg-transparent outline-none text-sm font-body placeholder:text-ink/40 dark:placeholder:text-paper-100/40"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ink/10 dark:bg-paper-100/15 text-ink/50 dark:text-paper-100/50">esc</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <div className="px-4 py-6 text-sm text-center text-ink/40 dark:text-paper-100/40">
              {lang === 'en' ? 'Nothing matches.' : 'कुछ मेल नहीं खाता।'}
            </div>
          )}

          {results.length > 0 && results.some(r => r.type === 'action') && (
            <div className="px-4 pt-1 pb-1 text-[10px] font-mono uppercase tracking-widest text-ink/35 dark:text-paper-100/35">
              {lang === 'en' ? 'Action queue' : 'कार्य कतार'}
            </div>
          )}

          {results.map((r, i) => {
            const isActive = i === activeIndex;

            if (r.type === 'action') {
              const tt = r.item[lang];
              return (
                <button
                  key={`a-${r.item.id}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => onSelectAction(r.idx)}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isActive ? 'bg-ink/5 dark:bg-paper-100/10' : ''}`}
                >
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 ${PRIORITY_STYLE[r.item.priority]}`}>
                    {t.priority[r.item.priority]}
                  </span>
                  <span className="text-sm truncate flex-1">{tt.title}</span>
                  <span className="text-[10px] font-mono text-ink/35 dark:text-paper-100/35 shrink-0">{r.item.id}</span>
                </button>
              );
            }

            const a = r.anomaly;
            const s = SEVERITY_STYLE[a.severity];
            const sysName = lang === 'en' ? a.sysEn : a.sysHi;
            const desc = lang === 'en' ? a.descEn : a.descHi;
            const prevType = results[i - 1]?.type;

            return (
              <div key={`anom-${a.id}`}>
                {prevType !== 'anomaly' && (
                  <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-ink/35 dark:text-paper-100/35">
                    {lang === 'en' ? 'Anomalies' : 'विसंगतियाँ'}
                  </div>
                )}
                <button
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => onSelectAnomaly(a.id)}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2 ${isActive ? 'bg-ink/5 dark:bg-paper-100/10' : ''}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`}></span>
                  <span className="text-sm truncate flex-1">{desc}</span>
                  <span className="text-[10px] text-ink/35 dark:text-paper-100/35 shrink-0">{sysName}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 px-4 py-2 border-t border-ink/10 dark:border-paper-100/15 text-[10px] font-mono text-ink/40 dark:text-paper-100/40">
          <span>↑↓ {lang === 'en' ? 'navigate' : 'नेविगेट करें'}</span>
          <span>↵ {lang === 'en' ? 'select' : 'चुनें'}</span>
        </div>
      </div>
    </div>
  );
}
