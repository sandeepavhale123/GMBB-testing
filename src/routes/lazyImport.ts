import { lazy } from "react";

export function lazyImport(factory: () => Promise<any>) {
  return lazy(() =>
    factory().then((module) => ({
      default: module.default,
    }))
  );
}
