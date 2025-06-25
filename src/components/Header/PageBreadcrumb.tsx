
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
  '/settings/listings': [
    { title: 'Dashboard', path: '/' },
    { title: 'Settings', path: '/settings' },
    { title: 'Manage Google Account', path: '/settings/google-account' }
  ],
  '/insights': [
    { title: 'Dashboard', path: '/' },
    { title: 'Insights', path: '/insights' }
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
  ]
};

export const PageBreadcrumb: React.FC = () => {
  const location = useLocation();
  const { accountId } = useParams();
  
  // Fetch account data to get the profile email
  const { data } = useAccountListings({
    accountId: accountId || '',
    page: 1,
    limit: 1,
  });
  
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
  let breadcrumbItems = routeToBreadcrumb[baseRoute] || [{ title: 'Dashboard', path: '/' }];

  // Customize breadcrumb for listings management page
  if (baseRoute === '/settings/listings' && accountId && data?.profileEmail) {
    breadcrumbItems = [
      { title: 'Dashboard', path: '/' },
      { title: 'Settings', path: '/settings/google-account' },
      { title: 'Manage Google Account', path: '/settings/google-account' },
      { title: data.profileEmail, path: `/settings/listings/${accountId}` }
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
