import { ANOMALIES, STR, SEVERITY_STYLE } from '../data.js';

export default function AnomalyPanel({ lang, anomalyRefs, highlightedId }) {
  const t = STR[lang];

  return (
    <div className="rounded-2xl border border-ink/10 dark:border-paper-100/15 p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-lg">{t.anomalyTitle}</h2>
        <span className="text-xs font-mono text-ink/40 dark:text-paper-100/40">{t.autoTag}</span>
      </div>
      <ul className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        {ANOMALIES.map(a => {
          const s = SEVERITY_STYLE[a.severity];
          const sysName = lang === 'en' ? a.sysEn : a.sysHi;
          const desc = lang === 'en' ? a.descEn : a.descHi;
          const isHighlighted = highlightedId === a.id;
          return (
            <li
              key={a.id}
              ref={el => { if (anomalyRefs) anomalyRefs.current[a.id] = el; }}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg ring-1 transition-shadow duration-300 ${s.ring} ${
                isHighlighted ? 'ring-2 ring-signal-amber bg-signal-amber/10' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.dot}`}></span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-mono uppercase tracking-wide ${s.text}`}>{t.severity[a.severity]}</span>
                  <span className="text-xs text-ink/40 dark:text-paper-100/40">{sysName}</span>
                </div>
                <p className="text-sm mt-0.5">{desc}</p>
                <span className="text-[11px] font-mono text-ink/40 dark:text-paper-100/40">{t.detected} {a.time}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
