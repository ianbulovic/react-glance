import { useEffect, useState } from "react";

export default function useKeyDown(
  key: string,
  {
    onKeyDown = null,
    onKeyUp = null,
    requireFocus = null,
    stealFocus = false,
    preventDefault = true,
  }: {
    onKeyDown?: null | (() => void | Promise<void>);
    onKeyUp?: null | (() => void | Promise<void>);
    requireFocus?: HTMLElement | null;
    stealFocus?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const [keyDown, setKeyDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const requiredIsFocused = requireFocus && requireFocus === activeElement;
      const otherIsFocused =
        !requiredIsFocused && activeElement?.tagName.match(/input|textarea/i);

      if (
        (requireFocus && !requiredIsFocused) ||
        (otherIsFocused && !stealFocus)
      ) {
        return;
      }

      if (e.key === key) {
        if (preventDefault) {
          e.preventDefault();
        }
        setKeyDown(true);
        if (onKeyDown) {
          onKeyDown();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === key) {
        setKeyDown(false);
        if (onKeyUp) {
          onKeyUp();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [key, onKeyDown, onKeyUp, requireFocus, stealFocus, preventDefault]);

  return keyDown;
}
