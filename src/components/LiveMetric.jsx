import { useEffect, useRef, useState } from 'react';
import { STR, CUTOFFS } from '../data.js';
import Flap from './Flap.jsx';
import { ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, YAxis, XAxis, Tooltip } from 'recharts';

const pad = n => n.toString().padStart(2, '0');

const BURN_DOWN_DATA = [
  { time: '09:00', target: 500, dispatched: 120 },
  { time: '10:00', target: 1000, dispatched: 450 },
  { time: '11:00', target: 1500, dispatched: 900 },
  { time: '12:00', target: 2000, dispatched: 1400 },
  { time: '13:00', target: 2500, dispatched: null }, // future
  { time: '14:00', target: 3000, dispatched: null },
];

export default function LiveMetric({ lang, lowBw }) {
  const t = STR[lang];
  const [hms, setHms] = useState({ h: '00', m: '00', s: '00' });
  const [cutoffLabel, setCutoffLabel] = useState('—');
  const [queued, setQueued] = useState(1432);
  const queuedRef = useRef(1432);
  const [sparklineData, setSparklineData] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({ time: i, value: 1432 + Math.floor(Math.random() * 10) - 5 }))
  );

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
      const delta = Math.floor(Math.random() * 7) - 2;
      queuedRef.current = Math.max(0, queuedRef.current + delta);
      setQueued(queuedRef.current);
      setSparklineData(prev => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value: queuedRef.current }];
        return newData;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`rounded-2xl flex flex-col p-5 shadow-soft bg-ink text-paper-100 ${lowBw ? 'dark:bg-paper-100/[0.06]' : 'dark:bg-white/[0.03] dark:backdrop-blur-2xl dark:border dark:border-white/[0.08] dark:shadow-2xl border border-transparent'}`}>
      <div className="text-xs font-mono uppercase tracking-widest text-paper-100/50 mb-1">{t.cutoffLabel}</div>
      <div className="flap-wrap flex items-end gap-1 mb-2">
        <Flap value={hms.h} className="text-4xl sm:text-5xl font-semibold" />
        <span className="text-2xl text-paper-100/40 -translate-y-1">:</span>
        <Flap value={hms.m} className="text-4xl sm:text-5xl font-semibold" />
        <span className="text-2xl text-paper-100/40 -translate-y-1">:</span>
        <Flap value={hms.s} className="text-4xl sm:text-5xl font-semibold" />
      </div>
      <div className="text-xs text-paper-100/60 mb-4">{cutoffLabel}</div>

      {!lowBw && (
        <div className="h-16 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={BURN_DOWN_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(128,128,128,0.1)' }} 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: 'transparent', borderRadius: '4px', fontSize: '12px', color: '#F1F5F9' }} 
                itemStyle={{ color: '#F1F5F9' }} 
              />
              <Bar dataKey="target" name={lang === 'en' ? 'Target' : 'लक्ष्य'} fill="currentColor" fillOpacity={0.1} radius={[2, 2, 0, 0]} />
              <Bar dataKey="dispatched" name={lang === 'en' ? 'Dispatched' : 'भेजा गया'} fill="#10b981" radius={[2, 2, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="h-px bg-paper-100/15 mb-4"></div>
      
      <div className="flex items-baseline justify-between z-10 relative">
        <span className="text-xs font-mono uppercase tracking-widest text-paper-100/50">{t.queuedLabel}</span>
      </div>
      
      <div className="relative mt-1 min-h-[3rem] flex flex-col justify-end">
        {!lowBw && (
          <div className="absolute inset-x-0 bottom-0 top-auto h-12 z-0 opacity-60 overflow-hidden pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Area type="monotone" dataKey="value" stroke="#f43f5e" fill="url(#splitColor)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="z-10 relative">
          <Flap
            value={queued.toLocaleString(lang === 'en' ? 'en-IN' : 'hi-IN')}
            className="text-3xl font-semibold block relative"
          />
        </div>
      </div>
    </div>
  );
}
