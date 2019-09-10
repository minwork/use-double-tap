import {MouseEvent, MouseEventHandler, useCallback, useRef} from "react";

type EmptyCallback = () => void;

export type CallbackFunction<Target = Element> =
  | MouseEventHandler<Target>
  | EmptyCallback;

export type DoubleTapCallback<Target = Element> = CallbackFunction<
  Target
> | null;

interface UseDoubleTapResult<Target> {
  onClick?: CallbackFunction<Target>;
}

export function useDoubleTap<Target = Element>(
  callback: DoubleTapCallback<Target>,
  threshold: number = 300
): UseDoubleTapResult<Target> {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback<CallbackFunction<Target>>(
    (event: MouseEvent<Target>) => {
      if (!timer.current) {
        timer.current = setTimeout(() => {
          timer.current = null;
        }, threshold);
      } else {
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
