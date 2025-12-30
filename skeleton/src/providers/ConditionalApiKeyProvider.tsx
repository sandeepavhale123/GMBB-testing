import React from 'react';
import { useLocation } from 'react-router-dom';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';

interface ConditionalApiKeyProviderProps {
  children: React.ReactNode;
}

// Routes that need Google Places API functionality
const routesNeedingApiKey = [
  '/business', // Business search forms
  '/geo-ranking', // GEO ranking report creation
  '/module/geo-ranking', // GEO ranking module
  '/module/lead', // Lead module (for AddLeadModal)
  '/module/reputation', // Reputation module (for Add Business)
  '/keywords', // Keyword management (might use business search)
  '/settings', // Settings that might include business forms
];

// Public report routes that should NOT have API key calls
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

export const ConditionalApiKeyProvider: React.FC<ConditionalApiKeyProviderProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if current route is a public report route
  const isPublicReportRoute = publicReportRoutes.some(route => 
    location.pathname.startsWith(route)
  );
  
  // Check if current route needs API key
  const needsApiKey = routesNeedingApiKey.some(route => 
    location.pathname.startsWith(route)
  ) && !isPublicReportRoute;
  
  // Only wrap with ApiKeyProvider if the route needs it and it's not a public report
  if (needsApiKey) {
    return (
      <ApiKeyProvider>
        {children}
      </ApiKeyProvider>
    );
  }
  
  return <>{children}</>;
};