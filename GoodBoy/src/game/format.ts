const WORDS = ['', '', '', '', 'TRILLION', 'QUADRILLION', 'QUINTILLION', 'SEXTILLION', 'SEPTILLION', 'OCTILLION'];

/** 1,234,567 up to the trillions, then "4.20 QUADRILLION". */
export function fmt(n: number): string {
  if (!isFinite(n)) return '∞';
  n = Math.floor(n);
  if (n < 1e12) return n.toLocaleString('en-US');
  const group = Math.floor(Math.log10(n) / 3);
  const word = WORDS[group];
  if (!word) return n.toExponential(2).toUpperCase();
  return `${(n / Math.pow(1000, group)).toFixed(2)} ${word}`;
}

/** short form for tight spaces: 1.2K, 3.4M, 5B */
export function fmtShort(n: number): string {
  n = Math.floor(n);
  const units: [number, string][] = [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']];
  for (const [v, s] of units) if (n >= v) return `${+(n / v).toFixed(n / v < 10 ? 2 : 1)}${s}`;
  return n.toLocaleString('en-US');
}

/** GBP/sec can be fractional early on */
export function fmtRate(n: number): string {
  if (n < 100 && n % 1 !== 0) return n.toFixed(1);
  return fmt(n);
}

export function fmtDuration(sec: number): string {
  sec = Math.floor(sec);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (d) return `${d} DAY${d > 1 ? 'S' : ''} ${h} HR`;
  if (h) return `${h} HOUR${h > 1 ? 'S' : ''} ${m} MIN`;
  if (m) return `${m} MIN ${s} SEC`;
  return `${s} SEC`;
}
