import { useLocalStorage } from './useLocalStorage';

export interface Preferences {
  restSoundEnabled: boolean;
  restVibrationEnabled: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  restSoundEnabled: true,
  restVibrationEnabled: true,
};

export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage<Preferences>('preferences', DEFAULT_PREFERENCES);

  function updatePreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }

  return { preferences, updatePreference };
}