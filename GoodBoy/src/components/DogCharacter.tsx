import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import type { Level } from '../config/levels';
import { spriteUrl } from '../config/levels';
import { fmtShort } from '../game/format';
import { DogSpeechBubble } from './DogSpeechBubble';

interface Float {
  id: number;
  x: number;
  y: number;
  text: string;
  big: boolean;
}

export interface DogHandle {
  /** play pet feedback; x/y are 0..1 within the stage (random if omitted) */
  react: (amount: number, x?: number, y?: number) => void;
}

interface Props {
  level: Level;
  speech: { id: number; text: string } | null;
  onPet: (x: number, y: number) => void;
}

let fid = 1;

export const DogCharacter = forwardRef<DogHandle, Props>(function DogCharacter({ level, speech, onPet }, ref) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const [floats, setFloats] = useState<Float[]>([]);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const react = useCallback((amount: number, x?: number, y?: number) => {
    const fx = x ?? 0.3 + Math.random() * 0.4;
    const fy = y ?? 0.25 + Math.random() * 0.3;
    const id = fid++;
    const text = amount === 1 ? '+1 GOOD BOY' : `+${fmtShort(amount)} GOOD BOY`;
    setFloats((f) => [...f.slice(-14), { id, x: fx, y: fy, text, big: Math.random() < 0.08 }]);
    setTimeout(() => setFloats((f) => f.filter((q) => q.id !== id)), 900);
    // bounce + wag (Web Animations so rapid clicks restart instantly)
    dogRef.current?.animate(
      [
        { transform: 'translateY(0) scale(1,1) rotate(0deg)' },
        { transform: 'translateY(-10px) scale(1.04,0.97) rotate(-2.5deg)', offset: 0.35 },
        { transform: 'translateY(0) scale(0.98,1.02) rotate(2deg)', offset: 0.7 },
        { transform: 'translateY(0) scale(1,1) rotate(0deg)' },
      ],
      { duration: 260, easing: 'ease-out' },
    );
  }, []);

  useImperativeHandle(ref, () => ({ react }), [react]);

  const handlePointer = (e: React.PointerEvent) => {
    const r = stageRef.current!.getBoundingClientRect();
    onPet((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };

  const src = spriteUrl(level.sprite);

  return (
    <div className={`dog-stage aura-${level.aura ?? 'none'}`} ref={stageRef}>
      {level.aura && <div className="aura" aria-hidden />}
      <DogSpeechBubble speech={speech} />
      <div
        className="dog-hit"
        role="button"
        tabIndex={-1}
        aria-label="Pet the dog"
        onPointerDown={handlePointer}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="dog" ref={dogRef}>
          {broken[src] ? (
            <div className="dog-placeholder">🐶</div>
          ) : (
            <img
              key={src}
              src={src}
              alt={level.name}
              draggable={false}
              className="dog-img"
              onError={() => setBroken((b) => ({ ...b, [src]: true }))}
            />
          )}
          <div className="dog-shadow" aria-hidden />
        </div>
      </div>
      <div className="floats" aria-hidden>
        {floats.map((f) => (
          <span key={f.id} className={`float ${f.big ? 'big' : ''}`} style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}>
            {f.text}
          </span>
        ))}
      </div>
    </div>
  );
});
