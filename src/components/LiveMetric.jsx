import { useEffect, useRef, useState } from 'react';
import { STR, CUTOFFS } from '../data.js';
import Flap from './Flap.jsx';

const pad = n => n.toString().padStart(2, '0');

export default function LiveMetric({ lang }) {
  const t = STR[lang];
  const [hms, setHms] = useState({ h: '00', m: '00', s: '00' });
  const [cutoffLabel, setCutoffLabel] = useState('—');
  const [queued, setQueued] = useState(1432);
  const queuedRef = useRef(1432);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const nowSec = now.getSeconds();
      let targetMin = CUTOFFS.find(c => c >= nowMin);
      if (targetMin === undefined) targetMin = CUTOFFS[0] + 24 * 60;

      const nowTotalSec = nowMin * 60 + nowSec;
      const targetTotalSec = targetMin * 60;
      let remaining = targetTotalSec - nowTotalSec;
      if (remaining < 0) remaining += 24 * 3600;

      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      setHms({ h: pad(h), m: pad(m), s: pad(s) });

      const cutH = Math.floor((targetMin % (24 * 60)) / 60);
      const cutM = (targetMin % (24 * 60)) % 60;
      setCutoffLabel((lang === 'en' ? 'Cutoff at ' : 'कट-ऑफ़ समय ') + pad(cutH) + ':' + pad(cutM));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);

  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 1;
      queuedRef.current = Math.max(0, queuedRef.current + delta);
      setQueued(queuedRef.current);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl bg-ink text-paper-100 dark:bg-paper-100/[0.06] p-5 shadow-soft">
      <div className="text-xs font-mono uppercase tracking-widest text-paper-100/50 mb-1">{t.cutoffLabel}</div>
      <div className="flap-wrap flex items-end gap-1 mb-3">
        <Flap value={hms.h} className="text-4xl sm:text-5xl font-semibold" />
        <span className="text-2xl text-paper-100/40 -translate-y-1">:</span>
        <Flap value={hms.m} className="text-4xl sm:text-5xl font-semibold" />
        <span className="text-2xl text-paper-100/40 -translate-y-1">:</span>
        <Flap value={hms.s} className="text-4xl sm:text-5xl font-semibold" />
      </div>
      <div className="text-xs text-paper-100/60 mb-4">{cutoffLabel}</div>
      <div className="h-px bg-paper-100/15 mb-4"></div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-paper-100/50">{t.queuedLabel}</span>
      </div>
      <Flap
        value={queued.toLocaleString(lang === 'en' ? 'en-IN' : 'hi-IN')}
        className="text-3xl font-semibold mt-1 block"
      />
    </div>
  );
}
