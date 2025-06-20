
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Target } from 'lucide-react';

const underPerformingAreas = [{
  area: 'Akurdi Road',
  rank: 15,
  competition: 'High',
  searchVolume: '2.1k',
  clicks: 45
}, {
  area: 'Pimpri Station',
  rank: 8,
  competition: 'Medium',
  searchVolume: '1.8k',
  clicks: 78
}, {
  area: 'Chinchwad',
  rank: 12,
  competition: 'High',
  searchVolume: '3.2k',
  clicks: 52
}, {
  area: 'Nigdi',
  rank: 6,
  competition: 'Low',
  searchVolume: '1.5k',
  clicks: 92
}];

export const UnderPerformingTable: React.FC = () => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Under-performing Areas</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Target className="w-4 h-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 mb-2">
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Area</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Rank</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Clicks</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Competition</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Action</div>
            </div>
            
            {/* Data Rows */}
            <div className="space-y-2">
              {underPerformingAreas.map((area, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-gray-900 text-xs sm:text-sm font-medium">{area.area}</div>
                  <div className="text-gray-900 text-xs sm:text-sm">#{area.rank}</div>
                  <div className="text-gray-900 text-xs sm:text-sm">{area.clicks}</div>
                  <div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      area.competition === 'High' ? 'bg-red-100 text-red-700' : 
                      area.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {area.competition}
                    </span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                      Optimize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
