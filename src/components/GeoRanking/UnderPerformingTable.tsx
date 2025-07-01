
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Target } from 'lucide-react';

// Mock competitor data structure
interface CompetitorData {
  compName: string;
  compRank: number;
  youRank: number;
  compRating: number;
}

const competitorData: CompetitorData[] = [
  {
    compName: 'J K Digitech',
    compRank: 2,
    youRank: 15,
    compRating: 4.8
  },
  {
    compName: 'Digital Bytz',
    compRank: 5,
    youRank: 8,
    compRating: 4.6
  },
  {
    compName: 'PUNK DIGITAL MARKETING',
    compRank: 3,
    youRank: 12,
    compRating: 4.7
  },
  {
    compName: 'TechnoVista Digital',
    compRank: 1,
    youRank: 6,
    compRating: 4.9
  }
];

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
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 mb-2">
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Name</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Rank</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Your Rank</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Competitor Rating</div>
              <div className="font-medium text-gray-700 text-xs sm:text-sm">Action</div>
            </div>
            
            {/* Data Rows */}
            <div className="space-y-2">
              {competitorData.map((competitor, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-gray-900 text-xs sm:text-sm font-medium">{competitor.compName}</div>
                  <div className="text-gray-900 text-xs sm:text-sm">#{competitor.compRank}</div>
                  <div className="text-gray-900 text-xs sm:text-sm">#{competitor.youRank}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-900 text-xs sm:text-sm">{competitor.compRating}</span>
                    <span className="text-yellow-500 text-xs">★</span>
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
