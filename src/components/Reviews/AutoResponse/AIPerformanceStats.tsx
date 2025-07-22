
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { TrendingUp, ThumbsUp } from 'lucide-react';

export const AIPerformanceStats: React.FC = () => {
  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">AI Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50 border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">95%</p>
                <p className="text-sm text-green-700">Response approval rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">4.8/5</p>
                <p className="text-sm text-blue-700">Avg helpfulness score</p>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};
