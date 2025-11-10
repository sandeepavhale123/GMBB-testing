/**
 * Utility to dynamically load Google Maps API only when needed
 * This prevents loading Google Maps on all pages
 */

export const loadGoogleMaps = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If Google Maps is already loaded, resolve immediately
    if ((window as any).google?.maps) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );
    if (existingScript) {
      // Wait for the existing script to load
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => 
        reject(new Error('Failed to load Google Maps'))
      );
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Setup callback
    (window as any).initMap = () => {
      resolve();
    };

    script.onload = () => {
      if ((window as any).google?.maps) {
        resolve();
      }
    };
    
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    
    document.head.appendChild(script);
  });
};
