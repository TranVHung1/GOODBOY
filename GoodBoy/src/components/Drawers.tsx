import { useEffect, useState, type ReactNode } from 'react';
import { ACHIEVEMENTS } from '../config/achievements';
import { LEVELS } from '../config/levels';
import { totalUpgradesOwned } from '../game/engine';
import { fmt, fmtDuration, fmtRate } from '../game/format';
import type { Game } from '../game/useGame';

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="scrim" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="drawer-head">
          <h2>{title}</h2>
          <button className="x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function StatsDrawer({ game, onClose }: { game: Game; onClose: () => void }) {
  const { state } = game;
  const [confirm, setConfirm] = useState(false);
  const rows: [string, string][] = [
    ['TOTAL GBP GENERATED', fmt(state.totalGbp)],
    ['GBP SUPPLY (BALANCE)', fmt(state.gbp)],
    ['GBP PER SECOND', fmtRate(game.gbps)],
    ['TOTAL PETS', fmt(state.pets)],
    ['CURRENT GOOD BOY LEVEL', LEVELS[game.levelIdx].name],
    ['UPGRADES OWNED', fmt(totalUpgradesOwned(state.owned))],
    ['ACHIEVEMENTS', `${state.achievements.length} / ${ACHIEVEMENTS.length}`],
    ['SESSION TIME', fmtDuration(game.sessionSeconds)],
    ['TOTAL TIME BEING GOOD', fmtDuration(state.playSeconds)],
  ];
  return (
    <Drawer title="GOOD BOY ECONOMY — STATS" onClose={onClose}>
      <dl className="stats">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="danger">
        {confirm ? (
          <>
            <p>Reset everything? He will forget. (He will still be good.)</p>
            <div className="row">
              <button
                className="btn red"
                onClick={() => {
                  game.reset();
                  setConfirm(false);
                  onClose();
                }}
              >
                YES, RESET
              </button>
              <button className="btn" onClick={() => setConfirm(false)}>
                NO
              </button>
            </div>
          </>
        ) : (
          <button className="btn ghost" onClick={() => setConfirm(true)}>
            RESET PROGRESS
          </button>
        )}
      </div>
    </Drawer>
  );
}

export function AchievementsDrawer({ game, onClose }: { game: Game; onClose: () => void }) {
  const got = new Set(game.state.achievements);
  return (
    <Drawer title={`ACHIEVEMENTS ${got.size}/${ACHIEVEMENTS.length}`} onClose={onClose}>
      <ul className="achs">
        {ACHIEVEMENTS.map((a) => (
          <li key={a.id} className={got.has(a.id) ? 'got' : ''}>
            <span className="ach-medal">{got.has(a.id) ? '🏅' : '🔒'}</span>
            <span>
              <b>{a.name}</b>
              <small>{a.desc}</small>
            </span>
          </li>
        ))}
      </ul>
      <div className="ladder">
        <h3>THE GOOD BOY LADDER</h3>
        <ol>
          {LEVELS.map((l, i) => (
            <li key={l.id} className={i <= game.levelIdx ? 'reached' : ''}>
              <span>{i <= game.levelIdx ? l.name : '?'.repeat(Math.min(l.name.length, 12))}</span>
              <span>{fmt(l.threshold)}</span>
            </li>
          ))}
        </ol>
      </div>
    </Drawer>
  );
}
