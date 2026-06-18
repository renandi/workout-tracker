import type { MuscleGroup } from '../types/workout';

const MUSCLE_GROUP_STYLES: Record<MuscleGroup, { bg: string; text: string }> = {
  Peito:        { bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-700 dark:text-red-400' },
  Costas:       { bg: 'bg-indigo-100 dark:bg-indigo-900/30',   text: 'text-indigo-700 dark:text-indigo-400' },
  Ombro:        { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-700 dark:text-amber-400' },
  Bíceps:       { bg: 'bg-sky-100 dark:bg-sky-900/30',         text: 'text-sky-700 dark:text-sky-400' },
  Tríceps:      { bg: 'bg-cyan-100 dark:bg-cyan-900/30',       text: 'text-cyan-700 dark:text-cyan-400' },
  Antebraço:    { bg: 'bg-teal-100 dark:bg-teal-900/30',       text: 'text-teal-700 dark:text-teal-400' },
  Perna:        { bg: 'bg-green-100 dark:bg-green-900/30',     text: 'text-green-700 dark:text-green-400' },
  Glúteo:       { bg: 'bg-pink-100 dark:bg-pink-900/30',       text: 'text-pink-700 dark:text-pink-400' },
  Panturrilha:  { bg: 'bg-lime-100 dark:bg-lime-900/30',       text: 'text-lime-700 dark:text-lime-400' },
  Abdômen:      { bg: 'bg-orange-100 dark:bg-orange-900/30',   text: 'text-orange-700 dark:text-orange-400' },
  Cardio:       { bg: 'bg-rose-100 dark:bg-rose-900/30',       text: 'text-rose-700 dark:text-rose-400' },
  'Corpo todo': { bg: 'bg-purple-100 dark:bg-purple-900/30',   text: 'text-purple-700 dark:text-purple-400' },
};

export function MuscleGroupBadge({ group }: { group: MuscleGroup }) {
  const styles = MUSCLE_GROUP_STYLES[group];
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
      {group}
    </span>
  );
}