import { ACTION_ITEMS, STR, PRIORITY_STYLE } from '../data.js';
import { playApproveSound, playHoldSound } from '../utils/audio.js';


export default function ActionQueue({ lang, itemState, setItemState, focusedIdx, itemRefs, lowBw }) {
  const t = STR[lang];
  const openCount = Object.values(itemState).filter(s => s === 'open').length;

  const setState = (id, state) => {
    if (!lowBw) {
      if (state === 'approved') playApproveSound();
      if (state === 'held') playHoldSound();
    }
    setItemState(prev => ({ ...prev, [id]: state }));
  };


  return (
    <section aria-labelledby="queueHeading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="queueHeading" className="font-display font-semibold text-lg">{t.queueTitle}</h2>
        <span className="text-xs font-mono text-ink/50 dark:text-paper-100/50">{openCount} {t.open}</span>
      </div>
      <p className="text-sm text-ink/60 dark:text-paper-100/60 mb-4 decorative">
        {t.queueHint.split(/(j|k|a|h)(?=\/|\s)/).map((chunk, i) =>
          ['j', 'k', 'a', 'h'].includes(chunk)
            ? <kbd key={i} className="px-1 py-0.5 rounded bg-ink/10 dark:bg-paper-100/15 font-mono text-xs">{chunk}</kbd>
            : chunk
        )}
      </p>

      <ol className="space-y-3">
        {ACTION_ITEMS.map((item, idx) => {
          const tt = item[lang];
          const state = itemState[item.id];
          const isDone = state !== 'open';
          const isFocused = idx === focusedIdx;

          return (
            <li
              key={item.id}
              ref={el => (itemRefs.current[idx] = el)}
              tabIndex={0}
              className={`focus-row rounded-xl border p-4 card-pad transition-colors ${
                isFocused ? 'border-signal-amber ring-1 ring-signal-amber/40' : (lowBw ? 'border-ink/10 dark:border-paper-100/15' : 'border-ink/10 dark:border-white/[0.08]')
              } ${isDone ? 'opacity-50' : (lowBw ? 'bg-white/40 dark:bg-paper-100/[0.03]' : 'bg-white/40 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:shadow-xl')} shadow-soft`}
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-ink/40 dark:text-paper-100/40 mt-1 w-5 shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display font-semibold text-[15px] truncate">{tt.title}</span>
                    <span className={`text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded ${PRIORITY_STYLE[item.priority]}`}>
                      {t.priority[item.priority]}
                    </span>
                    <span className="text-[10px] font-mono text-ink/40 dark:text-paper-100/40">{item.id}</span>
                  </div>
                  <p className="text-sm text-ink/70 dark:text-paper-100/70 mb-2">{tt.context}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50 dark:text-paper-100/50 decorative">
                    <span>{t.owner}: {tt.owner}</span>
                    <span>{t.due}: <span className="font-mono">{item.due}</span></span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  {isDone ? (
                    <>
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-lg ${state === 'approved' ? 'bg-signal-teal/15 text-signal-teal' : 'bg-signal-amber/15 text-signal-amber'}`}>
                        {state === 'approved' ? t.approved : t.held}
                      </span>
                      <button
                        onClick={() => setState(item.id, 'open')}
                        className="text-xs px-2 py-1.5 rounded-lg border border-ink/15 dark:border-paper-100/20 text-ink/60 dark:text-paper-100/60"
                      >{t.undo}</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setState(item.id, 'approved')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-ink text-paper dark:bg-paper-100 dark:text-ink hover:opacity-85"
                      >{t.approve}</button>
                      <button
                        onClick={() => setState(item.id, 'held')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-ink/20 dark:border-paper-100/25 hover:bg-ink/5 dark:hover:bg-paper-100/10"
                      >{t.hold}</button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
