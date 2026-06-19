interface RestTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  onSkip: () => void;
}

export function RestTimer({ secondsLeft, totalSeconds, onSkip }: RestTimerProps) {
  const progress = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  return (
    <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-xl px-3 py-2">
      <div className="relative w-10 h-10 shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-200 dark:text-orange-900" />
          <circle
            cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3"
            strokeDasharray={`${(progress / 100) * 100.5} 100.5`}
            className="text-orange-500 transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-orange-700 dark:text-orange-400">
          {secondsLeft}
        </span>
      </div>
      <span className="text-sm text-orange-700 dark:text-orange-400 flex-1">Descansando...</span>
      <button
        onClick={onSkip}
        className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
      >
        Pular
      </button>
    </div>
  );
}