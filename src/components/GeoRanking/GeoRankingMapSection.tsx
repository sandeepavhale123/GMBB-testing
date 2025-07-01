
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RankingMap } from './RankingMap';
import { RankingDistribution } from './RankingDistribution';
import { AIInsights } from './AIInsights';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { RankDetail, RankStats, ProjectDetails } from '../../api/geoRankingApi';

interface GeoRankingMapSectionProps {
  gridSize: string;
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
  rankDetails: RankDetail[];
  rankStats?: RankStats;
  projectDetails?: ProjectDetails;
  loading?: boolean;
}

export const GeoRankingMapSection: React.FC<GeoRankingMapSectionProps> = ({
  gridSize,
  onMarkerClick,
  rankDetails,
  rankStats,
  projectDetails,
  loading = false
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* Map Section - Fixed z-index */}
      <div className="xl:col-span-2">
        <Card className="bg-white shadow-sm relative z-10">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
              Ranking Map ({gridSize} Grid)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RankingMap 
              gridSize={gridSize}
              onMarkerClick={onMarkerClick}
              rankDetails={rankDetails}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Insights and Analysis */}
      <div className="space-y-4 sm:space-y-6">
        <RankingDistribution 
          rankDetails={rankDetails}
          rankStats={rankStats}
          loading={loading}
        />

        <AIInsights 
          rankStats={rankStats}
          projectDetails={projectDetails}
          loading={loading}
        />

        <CompetitorAnalysis 
          rankDetails={rankDetails}
          loading={loading}
        />
      </div>
    </div>
  );
};
