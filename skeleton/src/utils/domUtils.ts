/**
 * Utility functions for DOM manipulation and cleanup
 */

/**
 * Aggressive cleanup function that forces body styles reset
 * This is the primary cleanup method for modal-related issues
 */
export const forceBodyStylesReset = () => {
  try {
    // Dev warning for debugging
    if (document.body.style.pointerEvents === "none") {
      // console.warn('[DOM Utils] Auto-recovering from pointer-events: none on body');
    }

    // Force reset all potentially problematic styles
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.touchAction = "";

    // Remove any modal-related attributes
    document.body.removeAttribute("data-state");
    document.body.removeAttribute("data-scroll-locked");
    document.body.removeAttribute("style");

    // Remove any Radix UI modal classes
    document.body.classList.remove("data-[state=open]:overflow-hidden");
    document.body.classList.remove("overflow-hidden");

    // Force multiple repaints to ensure styles are applied
    document.body.offsetHeight;
    window.requestAnimationFrame(() => {
      document.body.offsetHeight;
    });
  } catch (error) {
    // console.warn('Failed to force reset body styles:', error);
  }
};

/**
 * Standard cleanup function (kept for backwards compatibility)
 */
export const cleanupBodyStyles = () => {
  try {
    document.body.style.removeProperty("pointer-events");
    document.body.style.removeProperty("overflow");

    // Also remove any Radix UI modal classes that might be lingering
    document.body.classList.remove("data-[state=open]:overflow-hidden");

    // Force a repaint to ensure styles are applied
    document.body.offsetHeight;
  } catch (error) {
    // console.warn('Failed to cleanup body styles:', error);
  }
};

/**
 * Global cleanup safety net - runs periodically to catch persistent styles
 */
let globalCleanupInterval: NodeJS.Timeout | null = null;

export const startGlobalCleanupMonitor = () => {
  // Clear any existing interval
  if (globalCleanupInterval) {
    clearInterval(globalCleanupInterval);
  }

  // Check every 500ms for persistent pointer-events: none
  globalCleanupInterval = setInterval(() => {
    const computedStyle = window.getComputedStyle(document.body);
    if (computedStyle.pointerEvents === "none") {
      // console.warn('Detected persistent pointer-events: none, forcing cleanup');
      forceBodyStylesReset();
    }
  }, 500);
};

export const stopGlobalCleanupMonitor = () => {
  if (globalCleanupInterval) {
    clearInterval(globalCleanupInterval);
    globalCleanupInterval = null;
  }
};

/**
 * MutationObserver-based cleanup for more reliable detection
 */
let bodyObserver: MutationObserver | null = null;

export const startBodyStyleObserver = () => {
  // Stop any existing observer
  stopBodyStyleObserver();

  bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const target = mutation.target as HTMLElement;
        if (target === document.body) {
          const style = target.style;
          if (style.pointerEvents === "none") {
            // console.warn('MutationObserver detected pointer-events: none, forcing cleanup');
            // Use requestAnimationFrame to avoid infinite loops
            requestAnimationFrame(() => {
              forceBodyStylesReset();
            });
          }
        }
      }
    });
  });

  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["style", "data-state", "data-scroll-locked"],
  });
};

export const stopBodyStyleObserver = () => {
  if (bodyObserver) {
    bodyObserver.disconnect();
    bodyObserver = null;
  }
};

/**
 * Window focus/blur handlers as additional safety net
 */
const handleWindowFocus = () => {
  // Small delay to ensure any pending operations complete
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(document.body);
    if (computedStyle.pointerEvents === "none") {
      // console.warn('Window focus detected pointer-events: none, forcing cleanup');
      forceBodyStylesReset();
    }
  }, 100);
};

export const addWindowFocusCleanup = () => {
  window.addEventListener("focus", handleWindowFocus);
  window.addEventListener("blur", handleWindowFocus);
};

export const removeWindowFocusCleanup = () => {
  window.removeEventListener("focus", handleWindowFocus);
  window.removeEventListener("blur", handleWindowFocus);
};

/**
 * Comprehensive cleanup function that uses all available methods
 */
export const comprehensiveCleanup = () => {
  // Primary cleanup
  forceBodyStylesReset();

  // Secondary cleanup with requestAnimationFrame
  requestAnimationFrame(() => {
    forceBodyStylesReset();
  });

  // Tertiary cleanup with slight delay
  setTimeout(() => {
    forceBodyStylesReset();
  }, 50);
};
