import * as React from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);

    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isMobile;
}

export function useDeviceBreakpoints() {
  const [breakpoints, setBreakpoints] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  React.useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setBreakpoints({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const tabletQuery = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => updateBreakpoints();

    mobileQuery.addEventListener("change", handleChange);
    tabletQuery.addEventListener("change", handleChange);
    desktopQuery.addEventListener("change", handleChange);

    updateBreakpoints();

    return () => {
      mobileQuery.removeEventListener("change", handleChange);
      tabletQuery.removeEventListener("change", handleChange);
      desktopQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return breakpoints;
}
