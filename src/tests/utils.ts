import {CallbackFunction, DoubleTapOptions, useDoubleTap} from "../index";
import {renderHook} from "@testing-library/react-hooks";

export const noop = () => {};

export function renderUseDoubleTap(
  callback: CallbackFunction | null,
  options: DoubleTapOptions = {}
) {
  return renderHook(
    ({
       callback,
       options
     }) => useDoubleTap(callback, options),
    {
      initialProps: {
        callback,
        options
      }
    }
  );
}
