
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const routeToTitle: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Monitor your business performance across all platforms' },
  '/ai-tasks': { title: 'AI Tasks', subtitle: 'Manage and track AI-powered optimization tasks' },
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
  '/location-dashboard': { title: 'Dashboard', subtitle: 'Monitor your business performance across all platforms' },
  '/reports': { title: 'Reports', subtitle: 'View and generate performance reports' },
  '/settings/team-members/edit': { title: 'Edit Team Member', subtitle: 'Manage team member profile, listing access, and feature permissions' }
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
      // Handle special case for settings/team-members/edit route
      if (segments[1] === 'settings' && segments[2] === 'team-members' && segments[3] === 'edit') {
        return '/settings/team-members/edit';
      }
      return `/${segments[1]}`;
    }
    return pathname;
  };
  
  const baseRoute = getBaseRoute(location.pathname);
  const pageInfo = routeToTitle[baseRoute] || { title: 'Dashboard', subtitle: 'Welcome back to your business dashboard' };

  return (
    <div className="min-w-0">
      <h5 className="font-semibold text-gray-900 mb-1">
        {pageInfo.title}
      </h5>
    </div>
  );
};
