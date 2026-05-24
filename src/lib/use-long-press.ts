import { useCallback, useRef } from "react";

type LongPressHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
  onTouchCancel: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
};

/**
 * Trigger `callback` after the user has held a press for `delay` ms.
 * Cancels on release, movement (scroll/swipe), or pointer leave.
 * Works for both touch (mobile) and mouse (desktop).
 */
export function useLongPress(callback: () => void, delay = 500): LongPressHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    cancel();
    firedRef.current = false;
    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      callback();
    }, delay);
  }, [callback, delay, cancel]);

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onTouchCancel: cancel,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
  };
}
