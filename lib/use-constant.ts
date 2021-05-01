import * as React from 'react';

type ResultBox<T> = { v: T };

/**
 * Based on https://github.com/Andarist/use-constant
 */
export function useConstant<T>(fn: () => T): T {
  const ref = React.useRef<ResultBox<T>>();

  if (!ref.current) {
    ref.current = { v: fn() };
  }

  return ref.current.v;
}
