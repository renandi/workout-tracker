import { usePreferences } from '../hooks/usePreferences';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { preferences, updatePreference } = usePreferences();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configurações</h2>

        <Toggle
          label="Som ao terminar descanso"
          checked={preferences.restSoundEnabled}
          onChange={v => updatePreference('restSoundEnabled', v)}
        />
        <Toggle
          label="Vibração ao terminar descanso"
          checked={preferences.restVibrationEnabled}
          onChange={v => updatePreference('restVibrationEnabled', v)}
        />

        <button
          onClick={onClose}
          className="w-full mt-2 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}