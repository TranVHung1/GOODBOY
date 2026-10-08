// $GOODBOY TOKEN INFO
// Before launch: leave CA empty → the site shows "CA: NOT ANNOUNCED YET" and the
// PUMP.FUN / DEXSCREENER buttons are greyed out with "SOON".
// After launch: paste the contract address (CA) below → copy button + live links.
//
// Logos: drop official logo files at
//   public/art/logos/pumpfun.png
//   public/art/logos/dexscreener.png
// (from each site's brand/press kit). Until then a simple generic icon is shown.

export const TOKEN = {
  ticker: '$GOODBOY',
  CA: '', // e.g. 'GoOdB0y...pump'
  notAnnouncedText: 'NOT ANNOUNCED YET',
  // Links. pumpfun / dexscreener are auto-built from the CA if left ''.
  pumpfun: '',
  dexscreener: '',
  x: '', // e.g. 'https://x.com/goodboy'      ('' = hidden)
  telegram: '', // e.g. 'https://t.me/goodboy'  ('' = hidden)
};

export const pumpfunUrl = () => TOKEN.pumpfun || (TOKEN.CA ? `https://pump.fun/coin/${TOKEN.CA}` : '');
export const dexscreenerUrl = () => TOKEN.dexscreener || (TOKEN.CA ? `https://dexscreener.com/solana/${TOKEN.CA}` : '');
