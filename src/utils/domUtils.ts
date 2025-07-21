
/**
 * Utility functions for DOM manipulation and cleanup
 */

/**
 * Removes pointer-events: none from the body element
 * This is useful for cleaning up after modal closures
 */
export const cleanupBodyStyles = () => {
  try {
    document.body.style.removeProperty('pointer-events');
    document.body.style.removeProperty('overflow');
    
    // Also remove any Radix UI modal classes that might be lingering
    document.body.classList.remove('data-[state=open]:overflow-hidden');
    
    // Force a repaint to ensure styles are applied
    document.body.offsetHeight;
  } catch (error) {
    console.warn('Failed to cleanup body styles:', error);
  }
};

/**
 * Ensures body styles are properly restored
 * Useful as a fallback cleanup method
 */
export const forceBodyStylesReset = () => {
  try {
    // Reset all potentially problematic styles
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    
    // Remove any modal-related attributes
    document.body.removeAttribute('data-state');
    document.body.removeAttribute('style');
    
    // Force repaint
    window.requestAnimationFrame(() => {
      document.body.offsetHeight;
    });
  } catch (error) {
    console.warn('Failed to force reset body styles:', error);
  }
};
