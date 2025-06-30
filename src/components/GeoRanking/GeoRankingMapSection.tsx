
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { RankingMap } from './RankingMap';
import { RankDetail, RankStats, ProjectDetails } from '../../api/geoRankingApi';

interface GeoRankingMapSectionProps {
  gridSize: string;
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
  rankDetails: RankDetail[];
  rankStats?: RankStats;
  projectDetails?: ProjectDetails;
  loading: boolean;
}

export const GeoRankingMapSection: React.FC<GeoRankingMapSectionProps> = ({
  gridSize,
  onMarkerClick,
  rankDetails,
  rankStats,
  projectDetails,
  loading
}) => {
  // Calculate position summary from rank details
  const calculatePositionSummary = () => {
    const summary = {
      '1-3': 0,
      '4-10': 0,
      '11-15': 0,
      '16-20+': 0
    };

    rankDetails.forEach(detail => {
      const rank = parseInt(detail.rank);
      if (rank >= 1 && rank <= 3) {
        summary['1-3']++;
      } else if (rank >= 4 && rank <= 10) {
        summary['4-10']++;
      } else if (rank >= 11 && rank <= 15) {
        summary['11-15']++;
      } else if (rank >= 16) {
        summary['16-20+']++;
      }
    });

    return summary;
  };

  const positionSummary = calculatePositionSummary();

  // Get dynamic values from projectDetails
  const distance = projectDetails?.distance ? `${projectDetails.distance}km` : '2km';
  const getFrequency = (schedule?: string) => {
    if (!schedule) return 'Daily';
    switch (schedule.toLowerCase()) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';  
      case 'monthly': return 'Monthly';
      default: return schedule;
    }
  };
  const frequency = getFrequency(projectDetails?.schedule);

  return (
    <div className="relative">
      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">GEO Grid Ranking Map</h3>
            </div>
            
            {/* Info Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                GPS: {rankDetails.length > 0 ? rankDetails[0].coordinate : '28.6139, 77.2090'}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Grid: {gridSize}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Distance: {distance}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Engine: Google Maps
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Frequency: {frequency}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {loading ? (
              <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
                <div className="text-gray-500">Loading map data...</div>
              </div>
            ) : (
              <RankingMap onMarkerClick={onMarkerClick} rankDetails={rankDetails} />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics Overlay - Top Left */}
      <Card className="absolute bg-white/95 backdrop-blur-sm shadow-lg z-55" style={{
        top: '150px',
        left: '33px',
        zIndex: '9999'
      }}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Metrics</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-md border overflow-hidden shadow-sm">
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">ARP</div>
              <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">
                {rankStats?.atr || '8.50'}
              </div>
            </div>
            
            <div className="flex rounded-md border overflow-hidden shadow-sm">
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">ATRP</div>
              <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">
                {rankStats?.atrp || '6.20'}
              </div>
            </div>
            
            <div className="flex rounded-md border overflow-hidden shadow-sm">
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">SoLV</div>
              <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">
                {rankStats?.solvability || '36.0'}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Position Summary Overlay - Top Right */}
      <Card className="absolute bg-white/95 backdrop-blur-sm shadow-lg z-55" style={{
        top: '150px',
        right: '33px',
        zIndex: '9999'
      }}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Position Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">1-3</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{positionSummary['1-3']}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">4-10</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{positionSummary['4-10']}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs text-gray-600">11-15</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{positionSummary['11-15']}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">16-20+</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{positionSummary['16-20+']}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
