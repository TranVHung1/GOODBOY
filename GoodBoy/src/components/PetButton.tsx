import { forwardRef } from 'react';

interface Props {
  onPet: () => void;
  power: number;
  compact?: boolean;
}

export const PetButton = forwardRef<HTMLButtonElement, Props>(function PetButton({ onPet, compact }, ref) {
  return (
    <button
      ref={ref}
      className={`pet-btn ${compact ? 'compact' : ''}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onPet();
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
          e.preventDefault();
          onPet();
        }
      }}
    >
      <span className="paw" aria-hidden>🐾</span> PET HIM
    </button>
  );
});
