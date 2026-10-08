import { LEVELS } from '../config/levels';
import { fmt } from '../game/format';

export function LevelProgress({ levelIdx, total }: { levelIdx: number; total: number }) {
  const cur = LEVELS[levelIdx];
  const next = LEVELS[levelIdx + 1];
  const pct = next ? Math.min(100, ((total - cur.threshold) / (next.threshold - cur.threshold)) * 100) : 100;
  return (
    <div className="progress">
      <div className="progress-row">
        <span>PROGRESS TO NEXT GOOD BOY LEVEL</span>
        <span className="progress-lvl">
          LV {levelIdx + 1}/{LEVELS.length}
        </span>
      </div>
      <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
        {Array.from({ length: 9 }).map((_, i) => (
          <i key={i} style={{ left: `${(i + 1) * 10}%` }} />
        ))}
      </div>
      <div className="progress-row small">
        {next ? (
          <>
            <span>
              NEXT: <b>{next.name}</b>
            </span>
            <span>
              {fmt(total)} / {fmt(next.threshold)}
            </span>
          </>
        ) : (
          <span>
            <b>MAXIMUM GOOD ACHIEVED.</b> HE IS STILL ACCEPTING PETS.
          </span>
        )}
      </div>
    </div>
  );
}
