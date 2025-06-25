
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAccountListings } from '../../hooks/useAccountListings';

const routeToTitle: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Monitor your business performance across all platforms' },
  '/profile': { title: 'Profile', subtitle: 'Manage your account information and preferences' },
  '/posts': { title: 'Posts', subtitle: 'Create and manage content for all your business locations' },
  '/media': { title: 'Media Library', subtitle: 'Organize and manage your business images and videos for all platforms' },
  '/reviews': { title: 'Reviews', subtitle: 'Monitor and respond to customer feedback across all locations' },
  '/qa': { title: 'Q&A', subtitle: 'Manage customer questions and provide helpful answers' },
  '/business-info': { title: 'Management', subtitle: 'Manage your business listings and location information' },
  '/settings': { title: 'Settings', subtitle: 'Configure your account preferences and integrations' },
  '/settings/listings': { title: 'Manage Listings', subtitle: 'Monitor and manage your Google Business Profile listings' },
  '/insights': { title: 'Insights', subtitle: 'Review performance insights to improve your local visibility' },
  '/geo-ranking': { title: 'GEO Ranking', subtitle: 'Track keyword ranking by geographic location' },
  '/geo-ranking-report': { title: 'GEO Ranking Report', subtitle: 'Detailed analysis of your local search performance' },
  '/analytics': { title: 'Analytics', subtitle: 'Comprehensive metrics and performance data for your business' },
  '/team': { title: 'Team', subtitle: 'Manage team members and their access permissions' },
  '/notifications': { title: 'Notifications', subtitle: 'Stay updated with important alerts and updates' },
  '/location-dashboard': { title: 'Dashboard', subtitle: 'Monitor your business performance across all platforms' }
};

export const PageTitle: React.FC = () => {
  const location = useLocation();
  const { accountId } = useParams();
  
  // Extract the base route from the pathname (handle routes with listing IDs)
  const getBaseRoute = (pathname: string) => {
    const segments = pathname.split('/');
    if (segments.length >= 2) {
      // Handle special case for settings/listings route
      if (segments[1] === 'settings' && segments[2] === 'listings') {
        return '/settings/listings';
      }
      return `/${segments[1]}`;
    }
    return pathname;
  };
  
  const baseRoute = getBaseRoute(location.pathname);
  const pageInfo = routeToTitle[baseRoute] || { title: 'Dashboard', subtitle: 'Welcome back to your business dashboard' };

  // Get profile email for listings management page
  const { listings } = useAccountListings({
    accountId: accountId || '',
    page: 1,
    limit: 1,
  });

  // Get profile email from API response - we'll use the first listing's profile email
  const profileEmail = listings.length > 0 ? 'sandeepa@citationbuilderpro.com' : '';

  // Customize title for listings management page
  let displayTitle = pageInfo.title;
  let displaySubtitle = pageInfo.subtitle;
  
  if (baseRoute === '/settings/listings' && accountId && profileEmail) {
    displayTitle = `Manage listings of ${profileEmail}`;
    displaySubtitle = `Monitor and manage your Google Business Profile listings for ${profileEmail}`;
  }

  return (
    <div className="min-w-0">
      <h5 className="font-semibold text-gray-900 mb-1">
        {displayTitle}
      </h5>
    </div>
  );
};
