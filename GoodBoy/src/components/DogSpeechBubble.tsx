import { useEffect, useState } from 'react';

export function DogSpeechBubble({ speech }: { speech: { id: number; text: string } | null }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!speech) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2300);
    return () => clearTimeout(t);
  }, [speech]);
  if (!speech || !visible) return null;
  return (
    <div className="bubble" key={speech.id} aria-live="polite">
      {speech.text}
    </div>
  );
}
