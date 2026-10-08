import { useState } from 'react';
import { TOKEN, dexscreenerUrl, pumpfunUrl } from '../config/token';
import { art } from '../game/art';

/** Logo image from public/art/logos/, with a generic icon fallback until the file exists. */
function Logo({ file, fallback }: { file: string; fallback: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <span className="tk-icon" aria-hidden>{fallback}</span>;
  return <img className="tk-logo" src={art(`logos/${file}`)} alt="" onError={() => setBroken(true)} draggable={false} />;
}

function LinkButton({ href, label, logo, fallback }: { href: string; label: string; logo?: string; fallback: string }) {
  const content = (
    <>
      {logo ? <Logo file={logo} fallback={fallback} /> : <span className="tk-icon" aria-hidden>{fallback}</span>}
      <span>{label}</span>
      {!href && <span className="tk-soon">SOON</span>}
    </>
  );
  return href ? (
    <a className="tk-btn" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <span className="tk-btn off" aria-disabled="true" title="Available after launch">
      {content}
    </span>
  );
}

export function TokenBar() {
  const [copied, setCopied] = useState(false);
  const ca = TOKEN.CA.trim();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ca);
    } catch {
      const el = document.getElementById('ca-text');
      if (el) window.getSelection()?.selectAllChildren(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const short = ca.length > 16 ? `${ca.slice(0, 6)}…${ca.slice(-6)}` : ca;

  return (
    <div className="token">
      {ca ? (
        <button className="ca" onClick={copy} title="Copy contract address">
          <span className="ca-k">CA</span>
          <span id="ca-text" className="ca-v">
            <span className="ca-full">{ca}</span>
            <span className="ca-short">{short}</span>
          </span>
          <span className="ca-copy">{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      ) : (
        <div className="ca pending" role="status">
          <span className="ca-k">CA</span>
          <span className="ca-v">{TOKEN.notAnnouncedText}</span>
          <span className="ca-wait">SOON</span>
        </div>
      )}

      <div className="tk-links">
        <LinkButton href={pumpfunUrl()} label="PUMP.FUN" logo="pumpfun.png" fallback="🚀" />
        <LinkButton href={dexscreenerUrl()} label="DEXSCREENER" logo="dexscreener.png" fallback="📈" />
        {TOKEN.x && <LinkButton href={TOKEN.x} label="X" fallback="𝕏" />}
        {TOKEN.telegram && <LinkButton href={TOKEN.telegram} label="TELEGRAM" fallback="✈️" />}
      </div>

      {!ca && <p className="tk-note">Only trust the CA posted on this site.</p>}
    </div>
  );
}
