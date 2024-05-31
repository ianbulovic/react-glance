import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (value === undefined) {
      setValue(stored ? JSON.parse(stored) : fallbackValue);
    } else {
      if (stored === JSON.stringify(value)) return;
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [fallbackValue, key, value]);

  const returnVal = value === undefined ? fallbackValue : value;
  return [returnVal, setValue] as const;
}
