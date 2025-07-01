
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Target } from 'lucide-react';
import { UnderPerformingArea } from '../../api/geoRankingApi';

interface UnderPerformingTableProps {
  underPerformingAreas: UnderPerformingArea[];
  loading?: boolean;
}

export const UnderPerformingTable: React.FC<UnderPerformingTableProps> = ({ 
  underPerformingAreas, 
  loading = false 
}) => {
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading under-performing areas...</div>
          </div>
        ) : (
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
                {underPerformingAreas.length > 0 ? (
                  underPerformingAreas.map((area) => (
                    <div
                      key={area.id}
                      className="grid grid-cols-5 gap-4 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-gray-900 text-xs sm:text-sm font-medium">{area.compName}</div>
                      <div className="text-gray-900 text-xs sm:text-sm">#{area.compRank}</div>
                      <div className="text-gray-900 text-xs sm:text-sm">
                        {area.youRank === 'NA' ? 'Not Ranked' : `#${area.youRank}`}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 text-xs sm:text-sm">{area.compRating}</span>
                        <span className="text-yellow-500 text-xs">★</span>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                          Optimize
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No under-performing areas found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
