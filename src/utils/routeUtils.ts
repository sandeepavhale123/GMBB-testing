/**
 * Utility functions for route detection and management
 */

// Public report routes that should NOT call profile/timezone APIs
const publicReportRoutes = [
  '/lead/gbp/',
  '/lead/prospect/',
  '/lead/citation/',
  '/lead/geo/',
  '/gmb-health/',
  '/gmb-ranking/',
  '/gmb-review/',
  '/gmb-insight/',
  '/gmb-media/',
  '/gmb-post/',
  '/gmb-citation/',
  '/multi-dashboard-report/',
  '/sharable-GEO-ranking-report/',
];

/**
 * Check if the current route is a public report route
 * @param pathname - Current pathname from window.location.pathname
 * @returns boolean - True if it's a public report route
 */
export const isPublicReportRoute = (pathname: string): boolean => {
  return publicReportRoutes.some(route => pathname.startsWith(route));
};

/**
 * Check if the current route should skip profile API calls
 * @param pathname - Current pathname (optional, defaults to window.location.pathname)
 * @returns boolean - True if profile API calls should be skipped
 */
export const shouldSkipProfileAPI = (pathname?: string): boolean => {
  const currentPath = pathname || window.location.pathname;
  return isPublicReportRoute(currentPath);
};