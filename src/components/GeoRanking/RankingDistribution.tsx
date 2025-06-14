
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CircularProgress } from '../ui/circular-progress';

const rankingData = [{
  position: 'Position 01-03',
  count: 2,
  color: 'bg-green-500'
}, {
  position: 'Position 04-10',
  count: 12,
  color: 'bg-yellow-500'
}, {
  position: 'Position 11-15',
  count: 8,
  color: 'bg-orange-500'
}, {
  position: 'Position 16-20+',
  count: 6,
  color: 'bg-red-500'
}];

export const RankingDistribution: React.FC = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Ranking Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
              <CircularProgress value={75} size={80} className="text-blue-500 sm:w-24 sm:h-24">
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold text-gray-900">28</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </CircularProgress>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 text-center">Keywords Tracked</p>
          </div>
          <div className="space-y-2">
            {rankingData.map((item, index) => 
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${item.color} rounded-sm flex-shrink-0`}></div>
                <div className="text-xs text-gray-600 flex-1 min-w-0">{item.position}</div>
                <div className="text-xs font-medium text-gray-900 flex-shrink-0">{item.count}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
