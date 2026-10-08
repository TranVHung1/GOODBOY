import type { EventEffect } from '../config/events';

/** Everything that is persisted to localStorage. */
export interface GameState {
  version: 1;
  gbp: number; // spendable balance
  totalGbp: number; // all GBP ever generated (drives level)
  pets: number;
  owned: Record<string, number>;
  achievements: string[];
  flags: string[];
  sound: boolean;
  playSeconds: number;
  createdAt: number;
  lastActive: number;
}

export interface ActiveEffect {
  eventId: string;
  effect: EventEffect;
  endsAt: number;
}

export interface Toast {
  id: number;
  kind: 'achievement' | 'event' | 'info';
  title: string;
  text?: string;
  sub?: string;
}
