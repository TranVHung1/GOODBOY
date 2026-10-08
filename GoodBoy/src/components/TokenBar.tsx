import { useState } from 'react';
import { TOKEN, pumpfunUrl } from '../config/token';

/** Small CA strip under the title. Renders nothing until TOKEN.CA is set in src/config/token.ts. */
export function TokenBar() {
  const [copied, setCopied] = useState(false);
  if (!TOKEN.CA) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(TOKEN.CA);
    } catch {
      const el = document.getElementById('ca-text');
      if (el) window.getSelection()?.selectAllChildren(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const short = TOKEN.CA.length > 16 ? `${TOKEN.CA.slice(0, 6)}…${TOKEN.CA.slice(-6)}` : TOKEN.CA;

  return (
    <div className="token">
      <button className="ca" onClick={copy} title="Copy contract address">
        <span className="ca-k">CA</span>
        <span id="ca-text" className="ca-v" data-full={TOKEN.CA}>
          <span className="ca-full">{TOKEN.CA}</span>
          <span className="ca-short">{short}</span>
        </span>
        <span className="ca-copy">{copied ? 'COPIED' : 'COPY'}</span>
      </button>
      <div className="token-links">
        {pumpfunUrl() && (
          <a href={pumpfunUrl()} target="_blank" rel="noreferrer">
            PUMP.FUN
          </a>
        )}
        {TOKEN.x && (
          <a href={TOKEN.x} target="_blank" rel="noreferrer">
            X
          </a>
        )}
        {TOKEN.telegram && (
          <a href={TOKEN.telegram} target="_blank" rel="noreferrer">
            TELEGRAM
          </a>
        )}
      </div>
    </div>
  );
}
