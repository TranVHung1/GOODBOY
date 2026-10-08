import { art } from '../game/art';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EVENTS } from '../config/events';
import { LEVELS } from '../config/levels';
import { fmt, fmtShort } from '../game/format';
import { startGlobalCounter, subscribeGlobal } from '../game/globalCounter';
import { useGame } from '../game/useGame';
import { DogCharacter, type DogHandle } from './DogCharacter';
import { AchievementsDrawer, StatsDrawer } from './Drawers';
import { GoodBoyCounter } from './GoodBoyCounter';
import { LevelProgress } from './LevelProgress';
import { LevelUpBanner, OfflineModal } from './Overlays';
import { PetButton } from './PetButton';
import { Toasts } from './Toasts';
import { TokenBar } from './TokenBar';
import { UpgradeStore } from './UpgradeStore';

const TAGLINES = [
  'There is no utility. He is just a very good boy.',
  'The economy runs on praise.',
  'GBP only goes up when you pet the dog.',
  'Every pet strengthens the economy.',
];

function useGlobal() {
  const [g, setG] = useState<{ available: boolean; total: number | null }>({ available: false, total: null });
  useEffect(() => {
    startGlobalCounter();
    return subscribeGlobal(setG);
  }, []);
  return g;
}

export function GoodBoyGame() {
  const game = useGame();
  const { state, levelIdx } = game;
  const level = LEVELS[levelIdx];
  const dogRef = useRef<DogHandle>(null);
  const petBtnRef = useRef<HTMLButtonElement>(null);
  const [drawer, setDrawer] = useState<'stats' | 'ach' | null>(null);
  const [tagline, setTagline] = useState(0);
  const [showMiniBar, setShowMiniBar] = useState(false);
  const global = useGlobal();

  useEffect(() => {
    const t = setInterval(() => setTagline((i) => (i + 1) % TAGLINES.length), 6000);
    return () => clearInterval(t);
  }, []);

  // mobile: show a sticky PET bar once the main button scrolls away
  useEffect(() => {
    const el = petBtnRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setShowMiniBar(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const petAt = useCallback(
    (x?: number, y?: number) => {
      const amount = game.pet();
      dogRef.current?.react(amount, x, y);
    },
    [game.pet],
  );

  // keyboard: space / enter anywhere pets him (unless typing in something)
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.repeat || drawer) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        petAt();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [petAt, drawer]);

  const activeEffects = game.effects.filter((e) => e.endsAt > game.now);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src={art('pfp.png')} alt="" />
          <span className="brand-name">GOODBOY</span>
          <span className="ticker">$GOODBOY</span>
        </div>
        <div className="global" title="Every pet, by everyone, everywhere.">
          <span className="global-k">GLOBAL GOOD BOY POINTS</span>
          {global.available && global.total !== null ? (
            <span className="global-v">{fmt(global.total)} GBP</span>
          ) : (
            <span className="global-v off">NOT CONNECTED YET</span>
          )}
        </div>
        <nav className="tools">
          <button className="tool" onClick={game.toggleSound} aria-label="Toggle sound" title="Sound">
            {state.sound ? '🔊' : '🔇'}
          </button>
          <button className="tool" onClick={() => setDrawer('ach')} title="Achievements">
            🏆 <span className="tool-n">{state.achievements.length}</span>
          </button>
          <button className="tool" onClick={() => setDrawer('stats')} title="Stats">
            📈 <span className="tool-l">STATS</span>
          </button>
        </nav>
      </header>

      <main className="layout">
        <section className="game">
          <div className="hero">
            <h1>GOODBOY</h1>
            <p className="hero-sub">THE GOOD BOY ECONOMY</p>
          </div>

          <TokenBar />

          <p className="whos">WHO'S A GOOD BOY?</p>

          <DogCharacter ref={dogRef} level={level} speech={game.speech} onPet={petAt} />

          <div className="rank">
            <span className="rank-k">CURRENT GOOD BOY LEVEL</span>
            <span className={`rank-v lvl-${level.id}`}>{level.name}</span>
          </div>

          <GoodBoyCounter gbp={state.gbp} gbps={game.gbps} petPower={game.petPower} />

          <PetButton ref={petBtnRef} onPet={() => petAt()} power={game.petPower} />

          {activeEffects.length > 0 && (
            <div className="effects">
              {activeEffects.map((e) => {
                const ev = EVENTS.find((x) => x.id === e.eventId);
                return (
                  <span key={e.eventId + e.endsAt} className={`chip chip-${e.effect.kind}`}>
                    {ev?.title} · {Math.ceil((e.endsAt - game.now) / 1000)}s
                  </span>
                );
              })}
            </div>
          )}

          <LevelProgress levelIdx={levelIdx} total={state.totalGbp} />

          <p className="tagline" key={tagline}>
            {TAGLINES[tagline]}
          </p>
        </section>

        <aside className="side">
          <UpgradeStore game={game} />
          <footer className="about">
            <p>
              <b>GOODBOY</b> is an internet dog powered entirely by positive reinforcement.
            </p>
            <p className="muted">That's enough.</p>
          </footer>
        </aside>
      </main>

      <div className={`minibar ${showMiniBar ? 'show' : ''}`}>
        <span className="minibar-gbp">
          {fmtShort(state.gbp)} <small>GBP</small>
        </span>
        <PetButton compact onPet={() => petAt()} power={game.petPower} />
      </div>

      <Toasts toasts={game.toasts} onDismiss={game.dismissToast} />

      {drawer === 'stats' && <StatsDrawer game={game} onClose={() => setDrawer(null)} />}
      {drawer === 'ach' && <AchievementsDrawer game={game} onClose={() => setDrawer(null)} />}
      {game.offline && <OfflineModal report={game.offline} onClose={game.clearOffline} />}
      {game.levelUp && <LevelUpBanner key={game.levelUp.id} name={game.levelUp.name} onDone={game.clearLevelUp} />}
    </div>
  );
}
