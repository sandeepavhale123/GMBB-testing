import React from "react";

export function lazyImport<T extends React.ComponentType<any>>(
  factory: () => Promise<any>
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    factory().then((module) => ({
      default: module.default || module,
    }))
  ) as React.LazyExoticComponent<T>;
}
