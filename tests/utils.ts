import React from "react";
import { CallbackFunction, DoubleTapOptions, useDoubleTap } from '../src';
import { renderHook } from '@testing-library/react-hooks';

export function mockEvent<EventType extends React.SyntheticEvent = React.SyntheticEvent>(
  props?: Partial<EventType>
): EventType {
  return {
    ...props,
  } as EventType;
}

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
