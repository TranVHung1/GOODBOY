import { useEffect, useRef } from 'react';
import { LEVELS, spriteUrl } from '../config/levels';
import { fmt, fmtDuration } from '../game/format';
import type { OfflineReport } from '../game/useGame';

export function OfflineModal({ report, onClose }: { report: OfflineReport; onClose: () => void }) {
  return (
    <div className="scrim center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <p className="modal-k">WELCOME BACK</p>
        <h2>YOU WERE GONE FOR {fmtDuration(report.seconds)}.</h2>
        <p className="modal-big">THE DOG REMAINED GOOD.</p>
        <p className="modal-gbp">+{fmt(report.earned)} GBP</p>
        <button className="btn yellow" onClick={onClose}>
          🐾 PET HIM AGAIN
        </button>
      </div>
    </div>
  );
}

export function LevelUpBanner({ name, onDone }: { name: string; onDone: () => void }) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => done.current(), 3600);
    return () => clearTimeout(t);
  }, [name]);
  const lvl = LEVELS.find((l) => l.name === name);
  return (
    <div className="levelup" role="status">
      <div className="levelup-card">
        <div className="levelup-k">★ NEW GOOD BOY LEVEL ★</div>
        {lvl && <img src={spriteUrl(lvl.sprite)} alt="" className="levelup-dog" />}
        <div className="levelup-name">{name}</div>
        <div className="levelup-foot">$GOODBOY · THE GOOD BOY ECONOMY</div>
      </div>
    </div>
  );
}
