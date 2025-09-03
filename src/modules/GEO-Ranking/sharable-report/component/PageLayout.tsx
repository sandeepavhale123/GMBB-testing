import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { Header } from './Header';
import { MainBody } from './MainBody';
import { ShareableGeoRankingPage } from './GeoRankingPage';

export const ShareableGeoRankingLayout: React.FC = () => {
  const theme = useAppSelector(state => state.theme);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.bg_color || 'hsl(var(--background))' }}
    >
      <Header />
      <MainBody>
        <ShareableGeoRankingPage />
      </MainBody>
    </div>
  );
};