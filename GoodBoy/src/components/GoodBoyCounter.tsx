import { art } from '../game/art';
import { fmt, fmtRate, fmtShort } from '../game/format';

export function GoodBoyCounter({ gbp, gbps, petPower }: { gbp: number; gbps: number; petPower: number }) {
  return (
    <div className="counter">
      <div className="counter-label">YOUR GOOD BOY POINTS</div>
      <div className="counter-value">
        <img src={art('icons/coin.png')} alt="" className="coin" />
        <span className="num">{fmt(gbp)}</span>
        <span className="unit">GBP</span>
      </div>
      <div className="counter-sub">
        <span>
          <b>{fmtRate(gbps)}</b> GBP / SEC
        </span>
        <span className="dot">·</span>
        <span>
          1 PET = <b>{fmtShort(petPower)}</b> GBP
        </span>
      </div>
    </div>
  );
}
