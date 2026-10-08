import type { GameState } from './types';

const KEY = 'goodboy.save.v1';

export function freshState(): GameState {
  const now = Date.now();
  return {
    version: 1,
    gbp: 0,
    totalGbp: 0,
    pets: 0,
    owned: {},
    achievements: [],
    flags: [],
    sound: true,
    playSeconds: 0,
    createdAt: now,
    lastActive: now,
  };
}

export function load(): GameState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return { ...freshState(), ...parsed, version: 1 };
  } catch {
    return freshState();
  }
}

export function save(state: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, lastActive: Date.now() }));
  } catch {
    /* private mode / storage full — the dog remains good regardless */
  }
}

export function wipe() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
