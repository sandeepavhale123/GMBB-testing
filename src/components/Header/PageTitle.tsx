
import React from 'react';
import { useLocation } from 'react-router-dom';

const routeToTitle: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Overview', subtitle: 'Monitor your business performance' },
  '/profile': { title: 'Profile Settings', subtitle: 'Manage your account information' },
  '/posts': { title: 'Posts', subtitle: 'Create and manage your content' },
  '/media': { title: 'Media Library', subtitle: 'Organize your photos and videos' },
  '/reviews': { title: 'Reviews', subtitle: 'Monitor and respond to customer feedback' },
  '/qa': { title: 'Q&A Management', subtitle: 'Handle customer questions and answers' },
  '/businesses': { title: 'Business Management', subtitle: 'Manage your business listings' },
  '/settings': { title: 'Settings', subtitle: 'Configure your account preferences' },
  '/insights': { title: 'Insights', subtitle: 'Analyze your business data' },
  '/geo-ranking': { title: 'GEO Ranking', subtitle: 'Track your local search performance' },
  '/geo-ranking-report': { title: 'GEO Ranking Report', subtitle: 'Detailed ranking analysis' },
  '/analytics': { title: 'Analytics', subtitle: 'Monitor your business metrics' },
  '/team': { title: 'Team', subtitle: 'Manage team members and permissions' },
  '/notifications': { title: 'Notifications', subtitle: 'Stay updated with important alerts' }
};

export const PageTitle: React.FC = () => {
  const location = useLocation();
  const pageInfo = routeToTitle[location.pathname] || { title: 'Dashboard', subtitle: 'Welcome back' };

  return (
    <div className="min-w-0">
      <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
        {pageInfo.title}
      </h1>
      {pageInfo.subtitle && (
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
          {pageInfo.subtitle}
        </p>
      )}
    </div>
  );
};
