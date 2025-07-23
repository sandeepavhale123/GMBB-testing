
import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { useAccountListings } from '../../hooks/useAccountListings';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routeToBreadcrumb: Record<string, { title: string; path: string }[]> = {
  '/': [{ title: 'Dashboard', path: '/' }],
  '/location-dashboard': [{ title: 'Dashboard', path: '/location-dashboard' }],
  '/ai-tasks': [
    { title: 'Dashboard', path: '/' },
    { title: 'AI Tasks', path: '/ai-tasks' }
  ],
  '/profile': [
    { title: 'Dashboard', path: '/' },
    { title: 'Profile', path: '/profile' }
  ],
  '/posts': [
    { title: 'Dashboard', path: '/' },
    { title: 'Posts', path: '/posts' }
  ],
  '/media': [
    { title: 'Dashboard', path: '/' },
    { title: 'Media Library', path: '/media' }
  ],
  '/reviews': [
    { title: 'Dashboard', path: '/' },
    { title: 'Reviews', path: '/reviews' }
  ],
  '/qa': [
    { title: 'Dashboard', path: '/' },
    { title: 'Q&A', path: '/qa' }
  ],
  '/business-info': [
    { title: 'Dashboard', path: '/' },
    { title: 'Management', path: '/business-info' }
  ],
  '/settings': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings' }
  ],
  '/settings/google-account': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings/google-account' }
  ],
  '/settings/subscription': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings/subscription' }
  ],
  '/settings/branding': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings/branding' }
  ],
  '/settings/integrations': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings/integrations' }
  ],
  '/settings/listings': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings' },
    { title: 'Manage Google Account', path: '/settings/google-account' }
  ],
  '/insights': [
    { title: 'Dashboard', path: '/' },
    { title: 'Insights', path: '/insights' }
  ],
  '/keywords/:id': [
    { title: 'Dashboard', path: '/' },
    { title: 'Keywords', path: '/keywords' },
    { title: 'Keyword Tracking', path: '' }
  ],
  '/keywords/:id/add': [
    { title: 'Dashboard', path: '/' },
    { title: 'Keywords', path: '/keywords' },
    { title: 'Add keyword', path: '' }
  ],
  '/geo-ranking': [
    { title: 'Dashboard', path: '/' },
    { title: 'GEO Ranking', path: '/geo-ranking' }
  ],
  '/geo-ranking-report': [
    { title: 'Dashboard', path: '/' },
    { title: 'GEO Ranking', path: '/geo-ranking' },
    { title: 'Report', path: '/geo-ranking-report' }
  ],
  '/citation': [
    { title: 'Dashboard', path: '/' },
    { title: 'Citation Management', path: '/citation' }
  ],
  '/health': [
    { title: 'Dashboard', path: '/' },
    { title: 'GMB Health', path: '/health' }
  ],
  '/analytics': [
    { title: 'Dashboard', path: '/' },
    { title: 'Analytics', path: '/analytics' }
  ],
  '/team': [
    { title: 'Dashboard', path: '/' },
    { title: 'Team', path: '/team' }
  ],
  '/notifications': [
    { title: 'Dashboard', path: '/' },
    { title: 'Notifications', path: '/notifications' }
  ],
  '/reports': [
    { title: 'Dashboard', path: '/' },
    { title: 'Reports', path: '/reports' }
  ],
  '/settings/team-members': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings' },
    { title: 'Team Members', path: '/settings/team-members' }
  ]
};

export const PageBreadcrumb: React.FC = () => {
  const location = useLocation();
  const { accountId } = useParams();
  
  // Fetch account data to get the profile email
  const { profileEmail } = useAccountListings({
    accountId: accountId || '',
    page: 1,
    limit: 1,
  });
  
  // Extract the base route from the pathname (handle routes with listing IDs)
  const getBaseRoute = (pathname: string) => {
    const segments = pathname.split('/');
    if (segments.length >= 2) {
      // Handle special case for settings sub-routes
      if (segments[1] === 'settings' && segments[2]) {
        if (segments[2] === 'listings') {
          return '/settings/listings';
        }
        if (segments[2] === 'team-members' && segments[3] === 'edit') {
          return '/settings/team-members';
        }
        return `/settings/${segments[2]}`;
      }
      // Handle special case for keywords/add route
      if (segments[1] === 'keywords' && segments[3] === 'add') {
        return '/keywords/:id/add';
      }
      // Handle special case for keywords/:id route
      if (segments[1] === 'keywords' && segments[2] && !segments[3]) {
        return '/keywords/:id';
      }
      return `/${segments[1]}`;
    }
    return pathname;
  };
  
  const baseRoute = getBaseRoute(location.pathname);
  let breadcrumbItems = routeToBreadcrumb[baseRoute] || [{ title: 'Dashboard', path: '/' }];

  // Customize breadcrumb for listings management page
  if (baseRoute === '/settings/listings' && accountId && profileEmail) {
    breadcrumbItems = [
      { title: 'Dashboard', path: '/' },
      { title: 'Settings', path: '/settings/google-account' },
      { title: 'Manage Google Account', path: '/settings/google-account' },
      { title: profileEmail, path: `/settings/listings/${accountId}` }
    ];
  }

  // Customize breadcrumb for edit team member page
  if (baseRoute === '/settings/team-members' && location.pathname.includes('/edit/')) {
    const memberId = location.pathname.split('/').pop();
    breadcrumbItems = [
      { title: 'Dashboard', path: '/' },
      { title: 'Settings', path: '/settings' },
      { title: 'Team Members', path: '/settings/team-members' },
      { title: `Edit Team Member #${memberId}`, path: location.pathname }
    ];
  }

  return (
    <Breadcrumb className="flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="text-sm text-gray-500">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {item.title}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
