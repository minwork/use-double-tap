import React, { HTMLAttributes, useCallback } from "react";
import { DoubleTapCallback, DoubleTapOptions, useDoubleTap } from "../src";
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";

export interface TestComponentProps {
    callback?: DoubleTapCallback;
    threshold?: number;
    options?: DoubleTapOptions;
}

const TestComponent: React.FC<TestComponentProps> = ({ callback = () => {}, threshold, options }) => {
    const handleDoubleTap = useCallback(
        event => {
            callback && callback(event);
        },
        [callback]
    );
    const bind = useDoubleTap(callback === null ? callback : handleDoubleTap, threshold, options);

    return <button {...bind}>Click me</button>;
};

export function createShallowTestComponent<Target = Element>(
  props: TestComponentProps
): ShallowWrapper<Required<TestComponentProps & HTMLAttributes<Target>>> {
  return shallow(<TestComponent {...props} />);
}

export function createMountedTestComponent<Target = Element>(
  props: TestComponentProps
): ReactWrapper<Required<TestComponentProps & HTMLAttributes<Target>>> {
  return mount(<TestComponent {...props} />);
}

export default TestComponent;
