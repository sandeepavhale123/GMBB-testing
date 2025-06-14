
import React from 'react';
import { Card, CardContent } from '../ui/card';

export const RankingMap: React.FC = () => {
  return (
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
          
          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 1-3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 4-10</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 11-15</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 16+</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
          <img 
            alt="GEO Grid Ranking Map" 
            className="w-full h-auto rounded-lg shadow-sm" 
            src="/lovable-uploads/1b136290-7743-4020-9468-ea83d1ff7054.png" 
          />
        </div>
      </CardContent>
    </Card>
  );
};
