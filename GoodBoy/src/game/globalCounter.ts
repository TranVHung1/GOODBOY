// GLOBAL GOOD BOY POINTS
// Shared counter of every pet, by everyone. Talks to /api/global (see api/global.ts).
// If the endpoint isn't configured (no database yet), `available` stays false and the UI says so.
// Nothing here is ever faked.

const ENDPOINT = (import.meta.env.VITE_GLOBAL_COUNTER_URL as string | undefined) || '/api/global';
const FLUSH_MS = 4000;
const POLL_MS = 10000;

type Listener = (s: { available: boolean; total: number | null }) => void;

let available = false;
let total: number | null = null;
let pending = 0;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l({ available, total: total === null ? null : total + pending }));
}

async function fetchTotal() {
  try {
    const r = await fetch(ENDPOINT, { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    if (typeof j.total !== 'number') throw new Error('bad');
    available = true;
    total = j.total;
  } catch {
    available = false;
  }
  emit();
}

async function flush() {
  if (!available || pending <= 0) return;
  const amount = pending;
  pending = 0;
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pets: amount }),
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    if (typeof j.total === 'number') total = j.total;
  } catch {
    pending += amount; // try again next flush
  }
  emit();
}

let started = false;
export function startGlobalCounter() {
  if (started) return;
  started = true;
  fetchTotal();
  setInterval(flush, FLUSH_MS);
  setInterval(() => pending === 0 && fetchTotal(), POLL_MS);
  window.addEventListener('pagehide', () => {
    if (available && pending > 0) {
      navigator.sendBeacon?.(ENDPOINT, new Blob([JSON.stringify({ pets: pending })], { type: 'application/json' }));
      pending = 0;
    }
  });
}

/** Count one pet (1 pet = 1 global GBP, no matter how powerful your local pets are). */
export function addGlobalPet() {
  if (!available) return;
  pending += 1;
  emit();
}

export function subscribeGlobal(l: Listener) {
  listeners.add(l);
  l({ available, total });
  return () => {
    listeners.delete(l);
  };
}
