
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
    <Card className="bg-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Under-performing Areas</CardTitle>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Target className="w-4 h-4 mr-2" />
            Optimize All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Area</th>
                <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Rank</th>
                <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Clicks</th>
                <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Competition</th>
                <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {underPerformingAreas.map((area, index) => 
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm font-medium">{area.area}</td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">#{area.rank}</td>
                  <td className="py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">{area.clicks}</td>
                  <td className="py-3 px-2 sm:px-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      area.competition === 'High' ? 'bg-red-100 text-red-700' : 
                      area.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {area.competition}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      Optimize
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
