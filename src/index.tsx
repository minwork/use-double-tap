import { useCallback, useRef } from 'react';

type CallbackFunction = () => void;

interface UseDoubleTap {
  onClick?: CallbackFunction
}

export function useDoubleTap(callback: CallbackFunction | null, threshold: number = 300): UseDoubleTap {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback(() => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        timer.current = null;
      }, threshold);
    } else {
      clearTimeout(timer.current);
      timer.current = null;
      callback && callback();
    }
  }, [callback, threshold]);

  return callback ? {
    onClick: handler,
  } : {};
}
