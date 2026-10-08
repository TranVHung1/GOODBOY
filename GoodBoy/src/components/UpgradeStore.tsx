import { UPGRADES } from '../config/upgrades';
import { costMult, isRevealed, priceOf } from '../game/engine';
import type { Game } from '../game/useGame';
import { LockedCard, UpgradeCard } from './UpgradeCard';

export function UpgradeStore({ game }: { game: Game }) {
  const { state, effects, now, buy } = game;
  const revealed = UPGRADES.filter((u) => isRevealed(u, state));
  const nextLocked = UPGRADES.find((u) => !isRevealed(u, state));
  return (
    <section className="store">
      <div className="store-head">
        <h2>UPGRADES</h2>
        <span>Every pet strengthens the economy.</span>
      </div>
      <div className="store-list">
        {revealed.map((u) => {
          const price = priceOf(u, state, effects, now);
          return (
            <UpgradeCard
              key={u.id}
              upgrade={u}
              owned={state.owned[u.id] ?? 0}
              price={price}
              affordable={state.gbp >= price}
              inflated={costMult(u.id, effects, now) > 1}
              onBuy={() => buy(u.id)}
            />
          );
        })}
        {nextLocked && <LockedCard cost={nextLocked.baseCost} />}
      </div>
    </section>
  );
}
