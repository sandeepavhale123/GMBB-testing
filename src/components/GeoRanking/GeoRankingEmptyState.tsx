import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Credits } from '../../api/geoRankingApi';

interface GeoRankingEmptyStateProps {
  onCheckRank: () => void;
  credits: Credits | null;
}

export const GeoRankingEmptyState: React.FC<GeoRankingEmptyStateProps> = ({
  onCheckRank,
  credits
}) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-8 sm:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Start Tracking Your Rankings
            </h2>
            <p className="text-gray-600 max-w-md">
              Track your Google Business Profile rankings across different locations to see how you perform in local search results.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Monitor local performance</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Track competitor rankings</span>
            </div>
          </div>

          {/* Credits Info */}
          {credits && (
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              You have <span className="font-semibold text-primary">{credits.remainingCredit}</span> credits remaining
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={onCheckRank}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
          >
            <Target className="w-5 h-5 mr-2" />
            Check Rank
          </Button>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 max-w-sm">
            Set up keyword tracking to monitor your business performance in local search results
          </p>
        </div>
      </CardContent>
    </Card>
  );
};