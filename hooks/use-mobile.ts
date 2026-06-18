import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [subscribe, getSnapshot] = React.useMemo(() => {
    if (typeof window === "undefined") {
      return [() => () => {}, () => false];
    }
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    return [
      (onChange: () => void) => {
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
      },
      () => mql.matches,
    ];
  }, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
