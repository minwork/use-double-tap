import React, {useCallback, useState} from 'react';
import { DoubleTapCallback, useDoubleTap} from "../index";

interface ContainerProps {
  callback?: DoubleTapCallback,
  threshold?: number
}

const Container: React.FC<ContainerProps> = ({ callback, threshold} = { callback: () => {}, threshold: undefined }) => {
  const [tapped, setTapped] = useState(0);

  const handleDoubleTap = useCallback((event) => {
    setTapped(current => current + 1);
    callback && callback(event);
  }, [callback]);

  const bind = useDoubleTap(callback === null ? callback : handleDoubleTap, threshold);

  return (
    <div>
      <p>Double tap / click button below to test.</p>
      <div data-testid="tapped">{tapped}</div>
      <button data-testid="button" {...bind}>Click me</button>
    </div>
  );
};

export default Container;
