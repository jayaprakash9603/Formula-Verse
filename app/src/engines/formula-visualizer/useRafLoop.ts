import { useCallback, useEffect, useRef } from "react";

export function useRafLoop(callback: () => void, deps: unknown[]) {
  const pending = useRef(false);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  const schedule = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    requestAnimationFrame(() => {
      cbRef.current();
      pending.current = false;
    });
  }, []);

  useEffect(() => {
    schedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return schedule;
}
