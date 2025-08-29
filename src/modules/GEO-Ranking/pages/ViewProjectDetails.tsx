import React from 'react';
import { useParams } from 'react-router-dom';
import { GeoRankingPage } from '@/components/GeoRanking/GeoRankingPage';

export const ViewProjectDetails: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  
  // The GeoRankingPage expects listingId as a URL parameter
  // We need to redirect to the correct format that GeoRankingPage expects
  React.useEffect(() => {
    if (project_id) {
      // Replace the current URL with the format that GeoRankingPage expects
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(`/view-project-details/${project_id}`, `/view-project-details//${project_id}`);
      window.history.replaceState(null, '', newPath);
    }
  }, [project_id]);

  return <GeoRankingPage />;
};