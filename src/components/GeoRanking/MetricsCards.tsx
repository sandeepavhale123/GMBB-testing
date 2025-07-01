
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import { KeywordDetailsResponse } from '../../api/geoRankingApi';

interface MetricsCardsProps {
  keywordDetails: KeywordDetailsResponse['data'] | null;
  totalKeywords: number;
  onCheckRank: () => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  keywordDetails,
  totalKeywords,
  onCheckRank
}) => {
  const avgRank = keywordDetails?.rankStats?.atr || '0';
  const solvability = keywordDetails?.rankStats?.solvability || '0%';

  return (
    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
      {/* Average Rank Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-blue-600 font-medium">Avg Rank</p>
              <p className="text-lg lg:text-xl font-bold text-blue-900">{avgRank}</p>
            </div>
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Total Keywords Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-green-600 font-medium">Keywords</p>
              <p className="text-lg lg:text-xl font-bold text-green-900">{totalKeywords}</p>
            </div>
            <Target className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Solvability Card with Check Rank Button */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-3 lg:p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs lg:text-sm text-purple-600 font-medium">Solvability</p>
                <p className="text-lg lg:text-xl font-bold text-purple-900">{solvability}</p>
              </div>
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
            <Button 
              onClick={onCheckRank}
              size="sm" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs"
            >
              Check Rank
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
