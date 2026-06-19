import { useState } from 'react';
import { useStopwatch } from '../hooks/useStopwatch';
import { getCalibratedAverage } from '../utils/workout';
import type { Exercise } from '../types/workout';

interface ExerciseCalibrationProps {
  exercise: Exercise;
  onUpdate: (fields: Partial<Exercise>) => void; 
}

export function ExerciseCalibration({ exercise, onUpdate }: ExerciseCalibrationProps) {
  const { elapsed, running, start, stop, reset } = useStopwatch();
  const times = exercise.calibratedSetTimes ?? [];
  const average = getCalibratedAverage(exercise);
  const [manualInput, setManualInput] = useState(exercise.manualSetSeconds?.toString() ?? '');

  function handleStop() {
    const seconds = stop();
    if (seconds > 0) onUpdate({ calibratedSetTimes: [...times, seconds] });
    reset();
  }

  function handleManualSave() {
    const value = Number(manualInput);
    if (value > 0) onUpdate({ manualSetSeconds: value });
  }

  function clearManual() {
    setManualInput('');
    onUpdate({ manualSetSeconds: undefined });
  }

  return (
    <div className="border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-3 flex flex-col gap-3">
      {/* Cronômetro */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cronometre um set real para calibrar automaticamente:
        </p>
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg px-3 py-2">
          <span className="text-lg font-mono text-gray-800 dark:text-gray-200">
            {elapsed.toFixed(1)}s
          </span>
          {!running ? (
            <button
              onClick={start}
              className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all"
            >
              Iniciar set
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all"
            >
              Parar
            </button>
          )}
        </div>

        {times.length > 0 && (
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>
              {times.length} set{times.length > 1 ? 's' : ''} calibrado{times.length > 1 ? 's' : ''} · média {average}s
            </span>
            <button onClick={() => onUpdate({ calibratedSetTimes: [] })} className="text-red-400 hover:text-red-500 transition-colors">
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-blue-100 dark:bg-blue-900" />
        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">ou</span>
        <div className="flex-1 h-px bg-blue-100 dark:bg-blue-900" />
      </div>

      {/* Input manual */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Já sabe o tempo? Digite direto, sem cronometrar:
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            placeholder="ex: 20"
            value={manualInput}
            onChange={e => setManualInput(e.target.value)}
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualSave}
            disabled={!manualInput}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40"
          >
            Salvar
          </button>
        </div>
        {exercise.manualSetSeconds !== undefined && (
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Tempo manual definido: {exercise.manualSetSeconds}s/set</span>
            <button onClick={clearManual} className="text-red-400 hover:text-red-500 transition-colors">
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Resumo de qual valor está sendo usado */}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">
        {average !== null
          ? `Usando calibração por cronômetro: ${average}s/set`
          : exercise.manualSetSeconds
          ? `Usando tempo manual: ${exercise.manualSetSeconds}s/set`
          : 'Nenhum valor definido — usando estimativa automática'}
      </p>
    </div>
  );
}