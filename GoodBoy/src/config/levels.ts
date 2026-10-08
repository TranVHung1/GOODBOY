import { art } from '../game/art';
// GOOD BOY LEVELS
// Level is based on TOTAL GBP ever generated (not current balance, so buying upgrades never makes him less good).
// `sprite` is a file in /public/art/dog/. Swap the PNGs to change the art — nothing else depends on them.
// `aura` adds a subtle CSS glow on top of the sprite. `say` = lines he unlocks at this level.

export interface Level {
  id: string;
  name: string;
  threshold: number;
  sprite: string;
  aura?: 'sparkle' | 'gold' | 'god';
  say?: string[];
}

export const LEVELS: Level[] = [
  { id: 'dog', name: 'DOG', threshold: 0, sprite: 'dog', say: ['bark', '?'] },
  { id: 'good-dog', name: 'GOOD DOG', threshold: 100, sprite: 'good-dog', say: ['good?', 'me?'] },
  { id: 'good-boy', name: 'GOOD BOY', threshold: 500, sprite: 'good-boy', say: ['i have collar', 'thank'] },
  { id: 'very-good-boy', name: 'VERY GOOD BOY', threshold: 2_500, sprite: 'very-good-boy', say: ['very?', 'bandana'] },
  { id: 'extremely-good-boy', name: 'EXTREMELY GOOD BOY', threshold: 10_000, sprite: 'very-good-boy', aura: 'sparkle', say: ['extremely', 'too much good?'] },
  { id: 'certified', name: 'CERTIFIED GOOD BOY', threshold: 50_000, sprite: 'certified', say: ['i am certified', 'look medal'] },
  { id: 'professional', name: 'PROFESSIONAL GOOD BOY', threshold: 250_000, sprite: 'professional', say: ['i have tie', 'meeting?', 'per my last bark'] },
  { id: 'institutional', name: 'INSTITUTIONAL GRADE GOOD BOY', threshold: 1_000_000, sprite: 'institutional', say: ['briefcase full of treat', 'buy'] },
  { id: 'too-good', name: 'TOO GOOD TO FAIL', threshold: 5_000_000, sprite: 'too-good', aura: 'gold', say: ['cannot fail', 'bail me out (treat)'] },
  { id: 'systemic', name: 'SYSTEMICALLY IMPORTANT GOOD BOY', threshold: 25_000_000, sprite: 'systemic', aura: 'gold', say: ['world needs me', 'i am the economy'] },
  { id: 'goodest', name: 'THE GOODEST BOY', threshold: 100_000_000, sprite: 'systemic', aura: 'god', say: ['goodest', 'no more good left. i took it'] },
  { id: 'god', name: 'GOD BOY', threshold: 1_000_000_000, sprite: 'god', aura: 'god', say: ['i am everywhere', 'good.', 'treat?'] },
];

export function levelIndexFor(totalGbp: number): number {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (totalGbp >= LEVELS[k].threshold) i = k;
  return i;
}

export const spriteUrl = (sprite: string) => art(`dog/${sprite}.png`);
