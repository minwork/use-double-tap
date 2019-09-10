import React from "react";
import {fireEvent, render} from "../tests/config";
import Container from '../tests/Container';
import {promiseTimeout, renderUseDoubleTap} from "../tests/utils";

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
  });
});

describe("Component usage", () => {
  test("Render component with initial tap count equal zero", () => {
    const { getByTestId } = render(<Container/>);
    const tapValue = getByTestId('tapped');

    expect(tapValue.textContent).toEqual("0");
  });

  test("Increase tap count on double click", () => {
    const { getByTestId } = render(<Container/>);
    const button = getByTestId('button');
    const tapValue = getByTestId('tapped');

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("3");
  });

  test("Trigger double tap only on clicks within threshold", async () => {
    const { getByTestId } = render(<Container/>);
    const button = getByTestId('button');
    const tapValue = getByTestId('tapped');

    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    await promiseTimeout(500);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("1");
  });

  test("Trigger double tap only on clicks within custom threshold", async () => {
    const { getByTestId } = render(<Container threshold={400}/>);
    const button = getByTestId('button');
    const tapValue = getByTestId('tapped');

    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    await promiseTimeout(500);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("1");

    fireEvent.click(button);
    await promiseTimeout(200);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("2");
  });

  test("Doesn't react to double tap when callback is null", () => {
    const { getByTestId } = render(<Container callback={null}/>);
    const button = getByTestId('button');
    const tapValue = getByTestId('tapped');

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(tapValue.textContent).toEqual("0");
  });

  test("Doesn't react to double tap when callback is null and has custom threshold", () => {
    const { getByTestId } = render(<Container callback={null} threshold={2000}/>);
    const button = getByTestId('button');
    const tapValue = getByTestId('tapped');

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

    const { getByTestId } = render(<Container callback={callback}/>);
    const button = getByTestId('button');

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
    let triggered = 0;
    const callback = () => {
      ++triggered;
    };

    const { getByTestId } = render(<Container callback={callback} threshold={150}/>);
    const button = getByTestId('button');

    expect(triggered).toEqual(0);

    fireEvent.click(button);
    await promiseTimeout(100);
    fireEvent.click(button);

    expect(triggered).toEqual(1);

    fireEvent.click(button);
    await promiseTimeout(200);
    expect(triggered).toEqual(1);

    fireEvent.click(button);
    fireEvent.click(button);
    expect(triggered).toEqual(2);
  });
});
