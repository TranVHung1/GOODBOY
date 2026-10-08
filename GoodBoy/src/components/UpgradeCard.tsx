import { useState } from 'react';
import { upgradeIconUrl, type Upgrade } from '../config/upgrades';
import { fmt, fmtShort } from '../game/format';

interface Props {
  upgrade: Upgrade;
  owned: number;
  price: number;
  affordable: boolean;
  inflated: boolean;
  onBuy: () => void;
}

export function UpgradeIcon({ upgrade, size = 52 }: { upgrade: Upgrade; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (upgrade.icon && !broken)
    return <img className="up-icon" src={upgradeIconUrl(upgrade.icon)} alt="" width={size} height={size} onError={() => setBroken(true)} draggable={false} />;
  return (
    <span className="up-icon emoji" style={{ width: size, height: size }}>
      {upgrade.emoji ?? '🐶'}
    </span>
  );
}

export function UpgradeCard({ upgrade, owned, price, affordable, inflated, onBuy }: Props) {
  return (
    <button className={`up-card ${affordable ? 'can' : 'cant'}`} onClick={onBuy} disabled={!affordable} aria-label={`Buy ${upgrade.name} for ${fmt(price)} GBP`}>
      <UpgradeIcon upgrade={upgrade} />
      <span className="up-main">
        <span className="up-name">{upgrade.name}</span>
        <span className="up-desc">{upgrade.desc}</span>
        <span className="up-meta">
          <span className={`up-cost ${inflated ? 'inflated' : ''}`}>
            {fmt(price)} GBP{inflated && ' ↑'}
          </span>
          <span className="up-rate">+{fmtShort(upgrade.gbps)} GBP/SEC</span>
        </span>
      </span>
      <span className="up-owned" title="owned">
        {owned}
      </span>
    </button>
  );
}

export function LockedCard({ cost }: { cost: number }) {
  return (
    <div className="up-card locked" aria-hidden>
      <span className="up-icon emoji">?</span>
      <span className="up-main">
        <span className="up-name">???</span>
        <span className="up-desc">Earn {fmtShort(cost / 2)} GBP to find out.</span>
      </span>
    </div>
  );
}
