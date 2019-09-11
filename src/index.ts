import {MouseEvent, MouseEventHandler, useCallback, useRef} from "react";

type EmptyCallback = () => void;

export type CallbackFunction<Target = Element> =
  | MouseEventHandler<Target>
  | EmptyCallback;

export type DoubleTapCallback<Target = Element> = CallbackFunction<
  Target
> | null;

export  interface DoubleTapOptions {
  threshold?: number;
  preventDefault?: boolean;
}

interface UseDoubleTapResult<Target> {
  onClick?: CallbackFunction<Target>;
}

export function useDoubleTap<Target = Element>(
  callback: DoubleTapCallback<Target>,
  options: DoubleTapOptions = {}
): UseDoubleTapResult<Target> {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const {
    threshold = 300,
    preventDefault = true
  } = options;

  const handler = useCallback<CallbackFunction<Target>>(
    (event: MouseEvent<Target>) => {
      if (!timer.current) {
        timer.current = setTimeout(() => {
          timer.current = null;
        }, threshold);
      } else {
        preventDefault && event.preventDefault();
        clearTimeout(timer.current);
        timer.current = null;
        callback && callback(event);
      }
    },
    [callback, threshold]
  );

  return callback
    ? {
        onClick: handler
      }
    : {};
}
