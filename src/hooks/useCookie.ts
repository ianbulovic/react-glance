import { useCallback, useState } from "react";
import Cookies from "js-cookie";

function useCookie<T>(
  key: string,
  initialValue: T,
  expires?: number | Date
): [T, (value: T) => void] {
  const [item, setItem] = useState<T>(() => {
    const cookie = Cookies.get(key);
    if (cookie) {
      try {
        return JSON.parse(cookie);
      } catch (e) {
        Cookies.remove(key);
      }
    }

    Cookies.set(key, JSON.stringify(initialValue), { expires });
    return initialValue;
  });

  const setCookie = useCallback(
    (value: T) => {
      setItem(value);
      Cookies.set(key, JSON.stringify(value), { expires });
    },
    [key, expires]
  );

  return [item, setCookie];
}

export default useCookie;
