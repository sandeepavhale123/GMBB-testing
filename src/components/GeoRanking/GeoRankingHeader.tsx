
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { KeywordSelector } from './KeywordSelector';
import { HeaderExportActions } from './HeaderExportActions';
import { MetricsCards } from './MetricsCards';
import { KeywordData, KeywordDetailsResponse } from '../../api/geoRankingApi';

interface GeoRankingHeaderProps {
  keywords: KeywordData[];
  selectedKeyword: string;
  selectedDate: string;
  keywordDetails: KeywordDetailsResponse['data'] | null;
  credits: any;
  onKeywordChange: (keywordId: string) => void;
  onDateChange: (dateId: string) => void;
  onClone: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshProgress: number;
  loading: boolean;
  keywordChanging: boolean;
  dateChanging: boolean;
  error: string | null;
  keywordsVersion?: number; // Add version prop
}

export const GeoRankingHeader: React.FC<GeoRankingHeaderProps> = ({
  keywords,
  selectedKeyword,
  selectedDate,
  keywordDetails,
  credits,
  onKeywordChange,
  onDateChange,
  onClone,
  onRefresh,
  isRefreshing,
  refreshProgress,
  loading,
  keywordChanging,
  dateChanging,
  error,
  keywordsVersion = 0,
}) => {
  console.log(`🔄 [${new Date().toISOString()}] GeoRankingHeader: Rendering with keywordsVersion:`, keywordsVersion);

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          <KeywordSelector
            keywords={keywords}
            selectedKeyword={selectedKeyword}
            selectedDate={selectedDate}
            keywordDetails={keywordDetails}
            onKeywordChange={onKeywordChange}
            onDateChange={onDateChange}
            loading={loading}
            keywordChanging={keywordChanging}
            dateChanging={dateChanging}
            isRefreshing={isRefreshing}
            keywordsVersion={keywordsVersion} // Pass version to KeywordSelector
          />

          <HeaderExportActions
            onClone={onClone}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            refreshProgress={refreshProgress}
            selectedKeyword={selectedKeyword}
            credits={credits}
          />
        </div>

        <MetricsCards
          keywordDetails={keywordDetails}
          loading={loading || keywordChanging || dateChanging}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
