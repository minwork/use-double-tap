import {CallbackFunction, useDoubleTap} from "../index";
import {renderHook} from "@testing-library/react-hooks";

export function renderUseDoubleTap(
  callback: CallbackFunction | null,
  threshold: number = 300
) {
  return renderHook(
    ({
       callback,
       threshold
     }: {
      callback: CallbackFunction | null;
      threshold: number;
    }) => useDoubleTap(callback, threshold),
    {
      initialProps: {
        callback,
        threshold
      }
    }
  );
}

export async function promiseTimeout(timeout: number) {
  return await new Promise((resolve) => setTimeout(resolve, timeout));
}
