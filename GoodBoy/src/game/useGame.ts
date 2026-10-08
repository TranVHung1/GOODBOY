import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ACHIEVEMENTS } from '../config/achievements';
import { BUY_LINES, IDLE_LINES, IDLE_LINE_AFTER, LEVEL_UP_LINES, PET_LINES, PET_LINE_CHANCE } from '../config/dialogue';
import { EVENTS, EVENT_FIRST_DELAY, EVENT_MAX, EVENT_MIN, type GameEvent } from '../config/events';
import { LEVELS, levelIndexFor } from '../config/levels';
import { UPGRADES } from '../config/upgrades';
import { OFFLINE_CAP_SECONDS, baseGbps, currentGbps, petPower, priceOf } from './engine';
import { addGlobalPet } from './globalCounter';
import { freshState, load, save, wipe } from './save';
import { setSoundEnabled, sfx } from './sound';
import type { ActiveEffect, GameState, Toast } from './types';

const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function pickEvent(): GameEvent {
  const total = EVENTS.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of EVENTS) if ((r -= e.weight) <= 0) return e;
  return EVENTS[0];
}

export interface OfflineReport {
  seconds: number;
  earned: number;
}

export function useGame() {
  // ---- load + offline earnings (once) ----
  const [boot] = useState(() => {
    const s = load();
    const now = Date.now();
    const away = Math.min((now - s.lastActive) / 1000, OFFLINE_CAP_SECONDS);
    const rate = baseGbps(s.owned);
    let report: OfflineReport | null = null;
    if (away > 30 && rate > 0) {
      const earned = Math.floor(rate * away);
      s.gbp += earned;
      s.totalGbp += earned;
      report = { seconds: away, earned };
    }
    s.lastActive = now;
    return { s, report };
  });

  const [state, setState] = useState<GameState>(boot.s);
  const [offline, setOffline] = useState<OfflineReport | null>(boot.report);
  const [effects, setEffects] = useState<ActiveEffect[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [speech, setSpeech] = useState<{ id: number; text: string } | null>(null);
  const [levelUp, setLevelUp] = useState<{ id: number; name: string } | null>(null);
  const [now, setNow] = useState(Date.now());
  const sessionStart = useRef(Date.now());

  const stateRef = useRef(state);
  stateRef.current = state;
  const effectsRef = useRef(effects);
  effectsRef.current = effects;

  const toastId = useRef(1);
  const lastPetAt = useRef(Date.now());
  const lastSpeechAt = useRef(0);
  const nextEventAt = useRef(Date.now() + EVENT_FIRST_DELAY * 1000);

  useEffect(() => setSoundEnabled(state.sound), [state.sound]);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastId.current++;
    setToasts((ts) => [...ts.slice(-3), { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), t.kind === 'event' ? 6500 : 4500);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((ts) => ts.filter((x) => x.id !== id)), []);

  const say = useCallback((text: string) => {
    lastSpeechAt.current = Date.now();
    setSpeech({ id: Date.now() + Math.random(), text });
  }, []);

  // ---- main loop: 10 ticks / sec ----
  useEffect(() => {
    let last = performance.now();
    let achCheck = 0;
    const id = setInterval(() => {
      const t = performance.now();
      const dt = Math.min((t - last) / 1000, 1);
      last = t;
      const nowMs = Date.now();
      setNow(nowMs);

      const s = stateRef.current;
      const rate = currentGbps(s, effectsRef.current, nowMs);
      const earned = rate * dt;
      setState((p) => ({ ...p, gbp: p.gbp + earned, totalGbp: p.totalGbp + earned, playSeconds: p.playSeconds + dt }));

      // expire effects
      if (effectsRef.current.some((e) => e.endsAt <= nowMs)) setEffects((es) => es.filter((e) => e.endsAt > nowMs));

      // random events
      if (nowMs >= nextEventAt.current && effectsRef.current.length === 0 && s.pets > 0) {
        nextEventAt.current = nowMs + rand(EVENT_MIN, EVENT_MAX) * 1000;
        const ev = pickEvent();
        let sub = ev.effectLabel;
        if (ev.effect.kind === 'bonus') {
          const bonus = Math.floor(Math.max(ev.effect.min, baseGbps(s.owned) * ev.effect.seconds));
          setState((p) => ({ ...p, gbp: p.gbp + bonus, totalGbp: p.totalGbp + bonus }));
          sub = `+${bonus.toLocaleString('en-US')} GBP`;
        } else {
          setEffects((es) => [...es, { eventId: ev.id, effect: ev.effect, endsAt: nowMs + (ev.effect as { duration: number }).duration * 1000 }]);
        }
        if (ev.flag) setState((p) => (p.flags.includes(ev.flag!) ? p : { ...p, flags: [...p.flags, ev.flag!] }));
        pushToast({ kind: 'event', title: ev.title, text: ev.text, sub });
        sfx.event();
        if (ev.id === 'squirrel') say('SQUIRREL');
      }

      // idle chatter
      if (nowMs - lastPetAt.current > IDLE_LINE_AFTER * 1000 && nowMs - lastSpeechAt.current > 14000) say(pick(IDLE_LINES));

      // achievements (2x / sec)
      if ((achCheck = (achCheck + 1) % 5) === 0) {
        const gbps = currentGbps(s, effectsRef.current, nowMs);
        const fresh = ACHIEVEMENTS.filter((a) => !s.achievements.includes(a.id) && a.check(s, gbps));
        if (fresh.length) {
          setState((p) => ({ ...p, achievements: [...p.achievements, ...fresh.map((a) => a.id)] }));
          fresh.forEach((a) => pushToast({ kind: 'achievement', title: a.name, text: a.desc }));
          sfx.achievement();
        }
      }
    }, 100);
    return () => clearInterval(id);
  }, [pushToast, say]);

  // ---- save ----
  useEffect(() => {
    const id = setInterval(() => save(stateRef.current), 5000);
    const onHide = () => save(stateRef.current);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onHide);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onHide);
    };
  }, []);

  // ---- level up ----
  const levelIdx = levelIndexFor(state.totalGbp);
  const prevLevel = useRef(levelIdx);
  useEffect(() => {
    if (levelIdx > prevLevel.current) {
      const L = LEVELS[levelIdx];
      setLevelUp({ id: Date.now(), name: L.name });
      sfx.levelUp();
      say(L.say ? pick(L.say) : pick(LEVEL_UP_LINES));
    }
    prevLevel.current = levelIdx;
  }, [levelIdx, say]);

  // ---- actions ----
  const pet = useCallback((): number => {
    const nowMs = Date.now();
    const amount = petPower(stateRef.current, effectsRef.current, nowMs);
    setState((p) => ({ ...p, gbp: p.gbp + amount, totalGbp: p.totalGbp + amount, pets: p.pets + 1 }));
    lastPetAt.current = nowMs;
    addGlobalPet();
    const r = Math.random();
    if (r < 0.04) {
      sfx.bark();
      say('bark');
    } else {
      sfx.pet();
      if (r < PET_LINE_CHANCE && nowMs - lastSpeechAt.current > 2500) {
        const lvl = LEVELS[levelIndexFor(stateRef.current.totalGbp)];
        say(lvl.say && Math.random() < 0.4 ? pick(lvl.say) : pick(PET_LINES));
      }
    }
    return amount;
  }, [say]);

  const buy = useCallback(
    (id: string) => {
      const u = UPGRADES.find((x) => x.id === id);
      if (!u) return false;
      const s = stateRef.current;
      const price = priceOf(u, s, effectsRef.current, Date.now());
      if (s.gbp < price) return false;
      const next = { ...s, gbp: s.gbp - price, owned: { ...s.owned, [id]: (s.owned[id] ?? 0) + 1 } };
      stateRef.current = next; // allow rapid double-buys within one frame
      setState(next);
      sfx.buy();
      if (Math.random() < 0.25 && Date.now() - lastSpeechAt.current > 3000) say(pick(BUY_LINES));
      return true;
    },
    [say],
  );

  const toggleSound = useCallback(() => setState((p) => ({ ...p, sound: !p.sound })), []);

  const reset = useCallback(() => {
    wipe();
    const f = freshState();
    f.sound = stateRef.current.sound;
    stateRef.current = f;
    prevLevel.current = 0;
    setState(f);
    setEffects([]);
    sessionStart.current = Date.now();
    nextEventAt.current = Date.now() + EVENT_FIRST_DELAY * 1000;
    save(f);
  }, []);

  const derived = useMemo(
    () => ({
      gbps: currentGbps(state, effects, now),
      petPower: petPower(state, effects, now),
    }),
    [state, effects, now],
  );

  return {
    state,
    effects,
    now,
    levelIdx,
    ...derived,
    toasts,
    dismissToast,
    speech,
    levelUp,
    clearLevelUp: () => setLevelUp(null),
    offline,
    clearOffline: () => setOffline(null),
    sessionSeconds: (now - sessionStart.current) / 1000,
    pet,
    buy,
    toggleSound,
    reset,
  };
}

export type Game = ReturnType<typeof useGame>;
