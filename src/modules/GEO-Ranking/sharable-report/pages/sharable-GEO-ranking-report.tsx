import React from 'react';
import { useParams } from 'react-router-dom';
import { ShareableGeoRankingLayout } from '../component/PageLayout';
import { useShareableGeoKeywords } from '@/hooks/useShareableGeoKeywords';

export const ShareableGEORankingReport: React.FC = () => {
  const { reportId } = useParams();
  
  // Fetch shareable keywords data to get project name
  const { data: shareableData } = useShareableGeoKeywords({ 
    reportId: reportId || '' 
  });

  return (
    <ShareableGeoRankingLayout projectName={shareableData?.data?.projectName} />
  );
};

export default ShareableGEORankingReport;