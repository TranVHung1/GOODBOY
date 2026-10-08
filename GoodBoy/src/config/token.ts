// $GOODBOY TOKEN INFO
// Paste the contract address (CA) here after launching on pump.fun.
// While CA is empty, nothing token-related is shown anywhere on the site.

export const TOKEN = {
  ticker: '$GOODBOY',
  CA: '', // e.g. 'GoOdB0y...pump'
  // Links are optional — leave '' to hide.
  pumpfun: '', // auto-filled from CA if left empty
  x: '', // e.g. 'https://x.com/goodboy'
  telegram: '', // e.g. 'https://t.me/goodboy'
};

export const pumpfunUrl = () => TOKEN.pumpfun || (TOKEN.CA ? `https://pump.fun/coin/${TOKEN.CA}` : '');
