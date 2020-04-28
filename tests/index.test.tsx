import React from 'react';
import { createShallowTestComponent } from './TestComponent';
import { mockEvent, renderUseDoubleTap } from './utils';
import { DoubleTapCallback } from '../src';

describe('Abstract hook usage', () => {
    test('Return expected result', () => {
        const { result } = renderUseDoubleTap(() => {});

        expect(result.current).toEqual({
            onClick: expect.any(Function),
        });
    });

    test('Accept two arguments', () => {
        const { result } = renderUseDoubleTap(() => {}, 1000);

        expect(result.current).toEqual({
            onClick: expect.any(Function),
        });
    });

    test('Accept three arguments', () => {
        const { result } = renderUseDoubleTap(() => {}, 1000, {
            onSingleTap: () => {},
        });

        expect(result.current).toEqual({
            onClick: expect.any(Function),
        });
    });

    test('Accept empty options argument', () => {
        const { result } = renderUseDoubleTap(() => {}, 1000, {});

        expect(result.current).toEqual({
            onClick: expect.any(Function),
        });
    });

    test('Null callback call return empty object', () => {
        const { result } = renderUseDoubleTap(null);

        expect(result.current).toEqual({});

        const { result: result2 } = renderUseDoubleTap(null, 500);
        expect(result2.current).toEqual({});

        const { result: result3 } = renderUseDoubleTap(null, 500, {});
        expect(result3.current).toEqual({});
    });
});

describe('Component usage', () => {
    let callback: DoubleTapCallback, mouseEvent: React.MouseEvent<HTMLButtonElement>;
    beforeEach(() => {
        jest.useFakeTimers();
        callback = jest.fn();
        mouseEvent = mockEvent<React.MouseEvent<HTMLButtonElement>>();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    test('Render component with initial tap count equal zero', () => {
        createShallowTestComponent({ callback });
        expect(callback).toBeCalledTimes(0);
    });

    test('Detect double click and pass proper event to callback', () => {
        const component = createShallowTestComponent({ callback });
        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledWith(mouseEvent);

        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledWith(mouseEvent);

        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledWith(mouseEvent);

        expect(callback).toBeCalledTimes(3);
    });

    test('Trigger double tap only on clicks within threshold', () => {
        const component = createShallowTestComponent({ callback, threshold: 400 });
        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);
        // Wait 500ms
        jest.runTimersToTime(500);

        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(1);
    });

    test('Trigger double tap only on clicks within custom threshold', () => {
        const component = createShallowTestComponent({ callback, threshold: 400 });

        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);

        // Wait 500ms
        jest.runTimersToTime(500);

        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(1);

        component.props().onClick(mouseEvent);

        // Wait 200ms
        jest.runTimersToTime(200);

        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(2);
    });

    test('Ignore double tap when callback is null', () => {
        const component = createShallowTestComponent({ callback: null });

        expect(() => {
            component.props().onClick(mouseEvent);
            component.props().onClick(mouseEvent);

            component.props().onClick(mouseEvent);
            component.props().onClick(mouseEvent);

            component.props().onClick(mouseEvent);
            component.props().onClick(mouseEvent);
        }).toThrowError();
        expect(callback).toBeCalledTimes(0);
    });

    test('Ignore double tap when callback is null and using custom threshold', () => {
        const component = createShallowTestComponent({ callback: null, threshold: 2000 });

        expect(() => {
            component.props().onClick(mouseEvent);
            component.props().onClick(mouseEvent);

            component.props().onClick(mouseEvent);
            component.props().onClick(mouseEvent);

            component.props().onClick(mouseEvent);
            component.props().onClick(mouseEvent);
        }).toThrowError();

        expect(callback).toBeCalledTimes(0);
    });

    test('Trigger custom callback', () => {
        const component = createShallowTestComponent({ callback });

        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);

        expect(callback).toBeCalledTimes(1);

        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(1);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(2);
    });

    test('Trigger custom callback when having custom threshold', () => {
        const component = createShallowTestComponent({ callback, threshold: 1500 });

        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);

        // Wait 100ms
        jest.runTimersToTime(100);

        component.props().onClick(mouseEvent);

        expect(callback).toBeCalledTimes(1);

        component.props().onClick(mouseEvent);

        jest.runTimersToTime(2000);

        expect(callback).toBeCalledTimes(1);

        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(callback).toBeCalledTimes(2);
    });

    test('Call single tap or double tap callback depending on clicks interval, supply proper event', () => {
        const singleTapCallback = jest.fn();

        const component = createShallowTestComponent({
            callback,
            threshold: 300,
            options: { onSingleTap: singleTapCallback },
        });

        expect(callback).toBeCalledTimes(0);

        component.props().onClick(mouseEvent);

        // Trigger single tap
        jest.runOnlyPendingTimers();
        expect(singleTapCallback).toBeCalledTimes(1);
        expect(singleTapCallback).toBeCalledWith(mouseEvent);
        expect(callback).toBeCalledTimes(0);

        // After double tap, counter should stay the same
        component.props().onClick(mouseEvent);
        component.props().onClick(mouseEvent);
        expect(singleTapCallback).toBeCalledTimes(1);
        expect(callback).toBeCalledTimes(1);

        // After double tap with 200ms delay, counter should stay the same
        jest.runOnlyPendingTimers();

        component.props().onClick(mouseEvent);
        jest.runTimersToTime(200);
        component.props().onClick(mouseEvent);
        expect(singleTapCallback).toBeCalledTimes(1);
        expect(callback).toBeCalledTimes(2);

        // Counter should increase when there was a long delay after first tap
        component.props().onClick(mouseEvent);

        // Wait 5 seconds
        jest.runTimersToTime(5000);
        expect(singleTapCallback).toBeCalledTimes(2);
        expect(callback).toBeCalledTimes(2);
    });
});
