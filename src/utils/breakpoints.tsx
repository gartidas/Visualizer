import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "./debounce";
import { BREAKPOINT_VALUES, BREAKPOINTS } from "~/constants";

export type BreakpointValue<T> = { [key in keyof IBreakPoints]?: T };

type SsrConfig<T> = { ssrValue: T };

export interface IBreakPoints {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  xxxl?: number;
}

export function isBreakpointValue<T>(
  value: unknown
): value is BreakpointValue<T> {
  if (!value || typeof value !== "object" || Object.keys(value).length === 0) {
    return false;
  }
  return Object.keys(value).every((x) => BREAKPOINTS.includes(x));
}

/**
 * @param ssrConfig if component using this hooks is being rendered on the server, then this config needs to be specified. Otherwise it assumes you are doing client side rendering only. If not provided and used on the server, then it might cause hydration error.
 */
export function useBreakpointValue<T>(
  breakpointValue: BreakpointValue<T>,
  ssrConfig?: SsrConfig<T>
) {
  const breakpointValueRef = useRef(breakpointValue);
  const ssrValueRef = useRef(ssrConfig?.ssrValue);

  const getValue = useCallback(() => {
    if (typeof window === "undefined") {
      return ssrValueRef.current;
    }
    const breakpointsToWatch = Object.keys(breakpointValueRef.current);
    if (breakpointsToWatch.length === 0) {
      return undefined;
    }
    const matchingBreakpoint = BREAKPOINTS.filter((breakpoint) =>
      breakpointsToWatch.includes(breakpoint)
    ).find(
      (breakpoint) =>
        window.matchMedia(
          `(min-width: ${
            BREAKPOINT_VALUES[breakpoint as keyof IBreakPoints]
          }em)`
        ).matches
    ) as keyof IBreakPoints;

    return matchingBreakpoint
      ? (breakpointValueRef.current[matchingBreakpoint] as T)
      : undefined;
  }, []);

  const [value, setValue] = useState<T | undefined>(
    ssrConfig ? ssrConfig.ssrValue : () => getValue()
  );

  useEffect(() => {
    setValue(getValue());
    const handler = debounce(() => setValue(getValue()), 30);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [getValue]);

  return value;
}
