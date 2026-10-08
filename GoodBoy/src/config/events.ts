// RANDOM EVENTS
// One event at a time. The first can fire after EVENT_FIRST_DELAY, then every EVENT_MIN..EVENT_MAX seconds.
// Effects are applied by the game loop in game/engine.ts.

export type EventEffect =
  | { kind: 'bonus'; seconds: number; min: number } // instant GBP = max(min, gbps * seconds)
  | { kind: 'passive'; mult: number; duration: number }
  | { kind: 'click'; mult: number; duration: number }
  | { kind: 'cost'; upgradeId: string; mult: number; duration: number }
  | { kind: 'pause'; duration: number };

export interface GameEvent {
  id: string;
  title: string;
  text: string;
  effectLabel: string;
  weight: number;
  effect: EventEffect;
  flag?: string; // remembered (used by achievements)
}

export const EVENT_FIRST_DELAY = 45; // seconds
export const EVENT_MIN = 70;
export const EVENT_MAX = 150;

export const EVENTS: GameEvent[] = [
  { id: 'mailman', title: 'GOOD BOY BONUS', text: 'The mailman said he was actually pretty chill.', effectLabel: '+GBP', weight: 4, effect: { kind: 'bonus', seconds: 60, min: 500 } },
  { id: 'grandma', title: 'GRANDMA VISIT', text: 'She brought the good treats.', effectLabel: '2x GBP for 30s', weight: 3, effect: { kind: 'passive', mult: 2, duration: 30 } },
  { id: 'belly', title: 'BELLY RUB EVENT', text: 'He has rolled over. Act now.', effectLabel: 'PET POWER 2x for 20s', weight: 3, effect: { kind: 'click', mult: 2, duration: 20 } },
  { id: 'shortage', title: 'TREAT SHORTAGE', text: 'Supply chain issues at the treat jar.', effectLabel: 'TREAT costs 2x for 30s', weight: 2, effect: { kind: 'cost', upgradeId: 'treat', mult: 2, duration: 30 } },
  { id: 'boom', title: 'MARKET OF GOODNESS IS BOOMING', text: 'Analysts confirm: still a good boy.', effectLabel: '+50% GBP/SEC for 45s', weight: 2, effect: { kind: 'passive', mult: 1.5, duration: 45 } },
  { id: 'squirrel', title: 'SQUIRREL', text: 'He saw a squirrel. Markets halted.', effectLabel: 'GBP/SEC paused 5s', weight: 1, effect: { kind: 'pause', duration: 5 }, flag: 'squirrel' },
];
