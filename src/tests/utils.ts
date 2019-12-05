import { CallbackFunction, DoubleTapOptions, useDoubleTap } from '../index';
import { renderHook } from '@testing-library/react-hooks';

export const noop = () => {};

export function renderUseDoubleTap<Target = Element>(
  callback: CallbackFunction<Target> | null,
  threshold: number = 300,
  options: DoubleTapOptions<Target> = {}
) {
  return renderHook(
        ({
            callback,
            threshold,
            options,
        }) => useDoubleTap(callback, threshold, options),
        {
            initialProps: {
                callback,
                threshold,
                options,
            },
        }
    );
}
