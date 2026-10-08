// Tiny synthesized sounds (WebAudio). No audio files, nothing plays until the user interacts.
let ctx: AudioContext | null = null;
let enabled = true;
const VOLUME = 0.12;

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

function ac(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 1, slideTo?: number, delay = 0) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(VOLUME * vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  pet() {
    tone(520 + Math.random() * 120, 0.06, 'triangle', 0.6, 780);
  },
  bark() {
    // two quick "wuf"s
    tone(330, 0.09, 'sawtooth', 0.7, 160);
    tone(360, 0.1, 'sawtooth', 0.6, 170, 0.13);
  },
  buy() {
    tone(660, 0.07, 'square', 0.5);
    tone(990, 0.1, 'square', 0.5, undefined, 0.07);
  },
  achievement() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, 'square', 0.45, undefined, i * 0.08));
  },
  levelUp() {
    [392, 523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.16, 'triangle', 0.7, undefined, i * 0.07));
  },
  event() {
    tone(880, 0.08, 'triangle', 0.5);
    tone(1175, 0.12, 'triangle', 0.5, undefined, 0.09);
  },
};
