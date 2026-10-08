// Pure game math. No React in here.
import { UPGRADES, upgradeCost, type Upgrade } from '../config/upgrades';
import type { ActiveEffect, GameState } from './types';

export const OFFLINE_CAP_SECONDS = 24 * 3600;

export function baseGbps(owned: Record<string, number>): number {
  let total = 0;
  for (const u of UPGRADES) total += (owned[u.id] ?? 0) * u.gbps;
  return total;
}

function active(effects: ActiveEffect[], now: number) {
  return effects.filter((e) => e.endsAt > now);
}

export function passiveMult(effects: ActiveEffect[], now: number): number {
  let m = 1;
  for (const e of active(effects, now)) {
    if (e.effect.kind === 'passive') m *= e.effect.mult;
    if (e.effect.kind === 'pause') return 0;
  }
  return m;
}

export function currentGbps(state: GameState, effects: ActiveEffect[], now: number): number {
  return baseGbps(state.owned) * passiveMult(effects, now);
}

/** A pet is worth 1, plus 3% of base GBP/sec once the economy gets going. */
export function petPower(state: GameState, effects: ActiveEffect[], now: number): number {
  let m = 1;
  for (const e of active(effects, now)) if (e.effect.kind === 'click') m *= e.effect.mult;
  return Math.max(1, Math.floor(1 + baseGbps(state.owned) * 0.03)) * m;
}

export function costMult(upgradeId: string, effects: ActiveEffect[], now: number): number {
  let m = 1;
  for (const e of active(effects, now))
    if (e.effect.kind === 'cost' && e.effect.upgradeId === upgradeId) m *= e.effect.mult;
  return m;
}

export function priceOf(u: Upgrade, state: GameState, effects: ActiveEffect[], now: number) {
  return upgradeCost(u, state.owned[u.id] ?? 0, costMult(u.id, effects, now));
}

/** Show an upgrade once you've earned half its base cost (or own one). */
export function isRevealed(u: Upgrade, state: GameState) {
  return (state.owned[u.id] ?? 0) > 0 || state.totalGbp >= u.baseCost * 0.5;
}

export function totalUpgradesOwned(owned: Record<string, number>) {
  return Object.values(owned).reduce((a, b) => a + b, 0);
}
