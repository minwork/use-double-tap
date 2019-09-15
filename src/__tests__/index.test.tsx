import React from "react";
import { fireEvent, render } from "../tests/config";
import Container from "../tests/Container";
import { noop, renderUseDoubleTap } from "../tests/utils";

describe("Basic usage", () => {
  test("Return expected result", () => {
    const { result } = renderUseDoubleTap(() => {});

    expect(result.current).toEqual({
      onClick: expect.any(Function)
    });
  });

  test("Accept two arguments", () => {
    const { result } = renderUseDoubleTap(() => {}, 1000);

    expect(result.current).toEqual({
      onClick: expect.any(Function)
    });
  });

  test("Null callback call return empty object", () => {
    const { result } = renderUseDoubleTap(null);

    expect(result.current).toEqual({});

    const { result: result2 } = renderUseDoubleTap(null, 500);
    expect(result2.current).toEqual({});
  });
});

describe("Component usage", () => {
  test("Render component with initial tap count equal zero", () => {
    const { getByTestId } = render(<Container />);
    const tapValue = getByTestId("tapped");

    expect(tapValue.textContent).toEqual("0");
  });

  test("Increase tap count on double click", () => {
    const { getByTestId } = render(<Container />);
    const button = getByTestId("button");
    const tapValue = getByTestId("tapped");

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("3");
  });

  test("Trigger double tap only on clicks within threshold", async () => {
    jest.useFakeTimers();

    const { getByTestId } = render(<Container />);
    const button = getByTestId("button");
    const tapValue = getByTestId("tapped");

    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    // Wait 500ms
    setTimeout(noop, 500);
    jest.runAllTimers();

    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("1");
  });

  test("Trigger double tap only on clicks within custom threshold", async () => {
    jest.useFakeTimers();

    const { getByTestId } = render(<Container threshold={400} />);
    const button = getByTestId("button");
    const tapValue = getByTestId("tapped");

    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);

    // Wait 500ms
    setTimeout(noop, 500);
    jest.runAllTimers();

    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("1");

    fireEvent.click(button);

    // Wait 200ms
    setTimeout(noop, 200);
    jest.runAllTimers();

    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("2");
  });

  test("Doesn't react to double tap when callback is null", () => {
    const { getByTestId } = render(<Container callback={null} />);
    const button = getByTestId("button");
    const tapValue = getByTestId("tapped");

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");
  });

  test("Doesn't react to double tap when callback is null and has custom threshold", () => {
    const { getByTestId } = render(
      <Container callback={null} threshold={2000} />
    );
    const button = getByTestId("button");
    const tapValue = getByTestId("tapped");

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");
  });

  test("Trigger custom callback", () => {
    let triggered = 0;
    const callback = () => {
      ++triggered;
    };

    const { getByTestId } = render(<Container callback={callback} />);
    const button = getByTestId("button");

    expect(triggered).toEqual(0);

    fireEvent.click(button);
    fireEvent.click(button);

    expect(triggered).toEqual(1);

    fireEvent.click(button);
    expect(triggered).toEqual(1);
    fireEvent.click(button);
    expect(triggered).toEqual(2);
  });

  test("Trigger custom callback when having custom threshold", async () => {
    jest.useFakeTimers();

    let triggered = 0;
    const callback = () => {
      ++triggered;
    };

    const { getByTestId } = render(
      <Container callback={callback} threshold={1500} />
    );
    const button = getByTestId("button");

    expect(triggered).toEqual(0);

    fireEvent.click(button);

    // Wait 100ms
    setTimeout(noop, 100);
    jest.runTimersToTime(100);

    fireEvent.click(button);

    expect(triggered).toEqual(1);

    fireEvent.click(button);

    // Wait 200ms
    setTimeout(noop, 2000);
    jest.runAllTimers();

    expect(triggered).toEqual(1);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(triggered).toEqual(2);
  });

  test("Callback get proper event as argument", () => {
    const { getByTestId } = render(
      <Container
        callback={event => {
          expect(event).toBeInstanceOf(MouseEvent);
        }}
      />
    );
    const button = getByTestId("button");
    fireEvent.click(button);
  });
});
