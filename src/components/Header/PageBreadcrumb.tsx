
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
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
  '/': [{ title: 'Home', path: '/' }],
  '/profile': [
    { title: 'Home', path: '/' },
    { title: 'Profile Settings', path: '/profile' }
  ],
  '/posts': [
    { title: 'Home', path: '/' },
    { title: 'Posts', path: '/posts' }
  ],
  '/media': [
    { title: 'Home', path: '/' },
    { title: 'Media Library', path: '/media' }
  ],
  '/reviews': [
    { title: 'Home', path: '/' },
    { title: 'Reviews', path: '/reviews' }
  ],
  '/qa': [
    { title: 'Home', path: '/' },
    { title: 'Q&A Management', path: '/qa' }
  ],
  '/businesses': [
    { title: 'Home', path: '/' },
    { title: 'Business Management', path: '/businesses' }
  ],
  '/settings': [
    { title: 'Home', path: '/' },
    { title: 'Settings', path: '/settings' }
  ],
  '/insights': [
    { title: 'Home', path: '/' },
    { title: 'Insights', path: '/insights' }
  ],
  '/geo-ranking': [
    { title: 'Home', path: '/' },
    { title: 'GEO Ranking', path: '/geo-ranking' }
  ],
  '/geo-ranking-report': [
    { title: 'Home', path: '/' },
    { title: 'GEO Ranking', path: '/geo-ranking' },
    { title: 'Report', path: '/geo-ranking-report' }
  ],
  '/analytics': [
    { title: 'Home', path: '/' },
    { title: 'Analytics', path: '/analytics' }
  ],
  '/team': [
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team' }
  ],
  '/notifications': [
    { title: 'Home', path: '/' },
    { title: 'Notifications', path: '/notifications' }
  ]
};

export const PageBreadcrumb: React.FC = () => {
  const location = useLocation();
  const breadcrumbItems = routeToBreadcrumb[location.pathname] || [{ title: 'Home', path: '/' }];

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="text-gray-600 font-medium">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path} className="text-gray-500 hover:text-gray-700 transition-colors">
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
