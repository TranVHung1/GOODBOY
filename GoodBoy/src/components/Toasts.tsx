import type { Toast } from '../game/types';

export function Toasts({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={`toast toast-${t.kind}`} onClick={() => onDismiss(t.id)}>
          <span className="toast-kicker">{t.kind === 'achievement' ? '🏆 ACHIEVEMENT' : t.kind === 'event' ? '📰 GOOD BOY NEWS' : 'NOTICE'}</span>
          <span className="toast-title">{t.title}</span>
          {t.text && <span className="toast-text">{t.text}</span>}
          {t.sub && <span className="toast-sub">{t.sub}</span>}
        </button>
      ))}
    </div>
  );
}
