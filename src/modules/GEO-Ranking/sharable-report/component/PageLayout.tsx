import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { Header } from './Header';
import { MainBody } from './MainBody';
import { ShareableGeoRankingPage } from './GeoRankingPage';

interface ShareableGeoRankingLayoutProps {
  projectName?: string;
}

export const ShareableGeoRankingLayout: React.FC<ShareableGeoRankingLayoutProps> = ({ projectName }) => {
  const theme = useAppSelector(state => state.theme);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.bg_color || 'hsl(var(--background))' }}
    >
      <Header projectName={projectName} />
      <MainBody>
        <ShareableGeoRankingPage />
      </MainBody>
    </div>
  );
};