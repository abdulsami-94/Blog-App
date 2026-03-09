"use client";

import { useState, useEffect, useCallback } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<A extends unknown[]>(callback: (...args: A) => void, delay: number): (...args: A) => void {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    (...args: A) => {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => {
        callback(...args);
        setTimeoutId(null);
      }, delay);
      setTimeoutId(id);
    },
    [callback, delay, timeoutId]
  );

  useEffect(() => () => { if (timeoutId) clearTimeout(timeoutId); }, [timeoutId]);

  return debounced;
}
