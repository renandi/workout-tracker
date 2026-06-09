import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value: T | ((prev: T) => T)) {
    try {
      const toStore = value instanceof Function ? value(stored) : value;
      setStored(toStore);
      localStorage.setItem(key, JSON.stringify(toStore));
    } catch {
      console.error('Erro ao salvar no localStorage');
    }
  }

  return [stored, setValue] as const;
}
