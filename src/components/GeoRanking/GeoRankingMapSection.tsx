
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { RankingMap } from './RankingMap';

interface GeoRankingMapSectionProps {
  gridSize: string;
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
}

export const GeoRankingMapSection: React.FC<GeoRankingMapSectionProps> = ({
  gridSize,
  onMarkerClick
}) => {
  return (
    <div className="relative">
      <Card className="bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">GEO Grid Ranking Map</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Grid Coverage:</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-medium">16/16 areas</span>
              </div>
            </div>
            
            {/* Info Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                GPS: 28.6139, 77.2090
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Grid: {gridSize}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Distance: 2km
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Engine: Google Maps
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                Frequency: Daily
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">Click on any position marker to view detailed competitor rankings</p>
          </div>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <RankingMap onMarkerClick={onMarkerClick} />
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics Overlay - Top Left */}
      <Card className="absolute left-4 bg-white/95 backdrop-blur-sm shadow-lg z-50" style={{ top: '100px' }}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Metrics</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-md border overflow-hidden shadow-sm">
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">ARP</div>
              <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">8.50</div>
            </div>
            
            <div className="flex rounded-md border overflow-hidden shadow-sm">
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">ATRP</div>
              <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">6.20</div>
            </div>
            
            <div className="flex rounded-md border overflow-hidden shadow-sm">
              <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">SoLV</div>
              <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">36.0%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Position Summary Overlay - Top Right */}
      <Card className="absolute right-4 bg-white/95 backdrop-blur-sm shadow-lg z-50" style={{ top: '100px' }}>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Position Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">1-3</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">2</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">4-10</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs text-gray-600">11-15</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">8</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">16+</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">6</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
