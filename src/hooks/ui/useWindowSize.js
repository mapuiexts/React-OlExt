import {useEffect, useState} from "react";
import {convertRemToPixels} from '../../core/deviceUnits';

/**
 * Hook to retrieve the current window size.
 * The returned window size is modified if the size of the window
 * is modified. So, it can be used to develop responsive components.
 * 
 * @returns The current window size {width, height}
 */
const useWindowSize = () => {
  const isSSR = typeof window === "undefined";
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? convertRemToPixels(75) : window.innerWidth,
    height: isSSR ? convertRemToPixels(50) : window.innerHeight,
  });

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  useEffect(() => {
    window.addEventListener("resize", changeWindowSize);

    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;