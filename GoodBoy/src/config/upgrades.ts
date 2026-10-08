import { art } from '../game/art';
// UPGRADES — edit freely to rebalance.
// cost of the Nth purchase = baseCost * COST_GROWTH ^ owned
// `icon` is a file in /public/art/upgrades/. If missing, `emoji` is shown instead.

export interface Upgrade {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  gbps: number; // GBP per second, per unit owned
  icon?: string;
  emoji?: string;
}

export const COST_GROWTH = 1.15;

export const UPGRADES: Upgrade[] = [
  { id: 'treat', name: 'TREAT', desc: 'A treat. For him.', baseCost: 10, gbps: 1, icon: 'treats' },
  { id: 'belly-rub', name: 'BELLY RUB', desc: 'He rolls over. The economy rolls over.', baseCost: 50, gbps: 3, icon: 'belly-rub' },
  { id: 'tennis-ball', name: 'NEW TENNIS BALL', desc: 'Still has the fuzz.', baseCost: 200, gbps: 10, icon: 'tennis-ball' },
  { id: 'grandma', name: 'GRANDMA', desc: 'She has never met a bad dog.', baseCost: 1_000, gbps: 40, icon: 'grandma' },
  { id: 'pro-petter', name: 'PROFESSIONAL DOG PETTER', desc: 'Licensed. Bonded. Gentle.', baseCost: 5_000, gbps: 150, icon: 'pro-petter' },
  { id: 'intern', name: 'GOOD BOY INTERN', desc: 'Unpaid. Says "good boy" for exposure.', baseCost: 20_000, gbps: 500, icon: 'intern' },
  { id: 'department', name: 'GOOD BOY DEPARTMENT', desc: 'Has a printer. Prints "good boy".', baseCost: 80_000, gbps: 1_600, emoji: '🗄️' },
  { id: 'factory', name: 'PETTING FACTORY', desc: 'Industrial-scale petting. Three shifts.', baseCost: 300_000, gbps: 5_000, icon: 'petting-factory' },
  { id: 'corporation', name: 'GOOD BOY CORPORATION', desc: 'Publicly praised.', baseCost: 1_200_000, gbps: 18_000, icon: 'corporation' },
  { id: 'fed', name: 'FEDERAL GOOD BOY RESERVE', desc: 'Controls the national supply of praise.', baseCost: 5_000_000, gbps: 65_000, icon: 'federal-reserve' },
  { id: 'ministry', name: 'MINISTRY OF GOOD BOYS', desc: 'Every citizen must pet him once.', baseCost: 20_000_000, gbps: 220_000, icon: 'ministry' },
  { id: 'imf', name: 'INTERNATIONAL GOOD BOY FUND', desc: 'Lends praise to developing dogs.', baseCost: 80_000_000, gbps: 800_000, emoji: '🌍' },
  { id: 'satellite', name: 'GOOD BOY SATELLITE', desc: 'Praises him from orbit.', baseCost: 350_000_000, gbps: 3_000_000, icon: 'satellite' },
  { id: 'orbital', name: 'ORBITAL PETTING STATION', desc: 'Zero-gravity belly rubs.', baseCost: 1_500_000_000, gbps: 11_000_000, icon: 'orbital-station' },
  { id: 'intergalactic', name: 'INTERGALACTIC GOOD BOY AUTHORITY', desc: 'Aliens agree. He is good.', baseCost: 7_000_000_000, gbps: 45_000_000, emoji: '🛸' },
];

export const upgradeCost = (u: Upgrade, owned: number, mult = 1) =>
  Math.ceil(u.baseCost * Math.pow(COST_GROWTH, owned) * mult);

export const upgradeIconUrl = (icon: string) => art(`upgrades/${icon}.png`);
