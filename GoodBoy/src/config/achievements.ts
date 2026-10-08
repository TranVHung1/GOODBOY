import type { GameState } from '../game/types';
import { levelIndexFor, LEVELS } from './levels';

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  check: (s: GameState, gbps: number) => boolean;
}

const lvl = (id: string) => LEVELS.findIndex((l) => l.id === id);

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-pet', name: "WHO'S A GOOD BOY?", desc: 'Pet him once.', check: (s) => s.pets >= 1 },
  { id: 'first-upgrade', name: 'GBP UP', desc: 'Buy your first upgrade.', check: (s) => Object.values(s.owned).some((n) => n > 0) },
  { id: 'pets-100', name: 'GOOD HAND', desc: '100 pets.', check: (s) => s.pets >= 100 },
  { id: 'pets-1000', name: 'CERTIFIED PETTER', desc: '1,000 pets.', check: (s) => s.pets >= 1_000 },
  { id: 'pets-10000', name: 'TOUCH GRASS', desc: 'Pet the dog 10,000 times.', check: (s) => s.pets >= 10_000 },
  { id: 'gbps-100', name: 'QUANTITATIVE PETTING', desc: 'Reach 100 GBP / SEC.', check: (_s, g) => g >= 100 },
  { id: 'economist', name: 'DOG ECONOMIST', desc: 'Generate 100,000 GBP.', check: (s) => s.totalGbp >= 100_000 },
  { id: 'certified', name: 'CERTIFIED', desc: 'Reach CERTIFIED GOOD BOY.', check: (s) => levelIndexFor(s.totalGbp) >= lvl('certified') },
  { id: 'too-good', name: 'TOO GOOD TO FAIL', desc: 'Reach TOO GOOD TO FAIL.', check: (s) => levelIndexFor(s.totalGbp) >= lvl('too-good') },
  { id: 'grandmas', name: "GRANDMA'S FAVORITE", desc: 'Own 100 Grandmas.', check: (s) => (s.owned['grandma'] ?? 0) >= 100 },
  { id: 'central-banker', name: 'CENTRAL BANKER', desc: 'Own a Federal Good Boy Reserve.', check: (s) => (s.owned['fed'] ?? 0) >= 1 },
  { id: 'space', name: 'SPACE PROGRAM', desc: 'Praise him from orbit.', check: (s) => (s.owned['satellite'] ?? 0) >= 1 },
  { id: 'squirrel', name: 'HE SAW A SQUIRREL', desc: 'Survive a market crash.', check: (s) => s.flags.includes('squirrel') },
  { id: 'goodest', name: 'THE GOODEST', desc: 'Reach 100M GBP.', check: (s) => s.totalGbp >= 100_000_000 },
  { id: 'god', name: 'GOD BOY', desc: 'Reach 1B GBP. He is everywhere now.', check: (s) => s.totalGbp >= 1_000_000_000 },
];
