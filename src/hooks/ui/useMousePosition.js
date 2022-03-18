import { useState, useEffect } from "react";

/**
 * Hook to provide the current mouse position
 * See: https://gist.github.com/whoisryosuke/99f23c9957d90e8cc3eb7689ffa5757c
 */
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = ev => {
    setMousePosition({ x: ev.clientX, y: ev.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};

export default useMousePosition;