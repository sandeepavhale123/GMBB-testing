import React from 'react';
import { useParams } from 'react-router-dom';
import { GeoRankingPage } from '@/components/GeoRanking/GeoRankingPage';

export const ViewProjectDetails: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  
  // Pass the project_id directly to GeoRankingPage as projectId prop
  const numericProjectId = project_id ? parseInt(project_id, 10) : undefined;

  return <GeoRankingPage projectId={numericProjectId} />;
};