
import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Download, RefreshCcw, Copy } from 'lucide-react';
import { Credits } from '../../api/geoRankingApi';

interface HeaderExportActionsProps {
  isExporting: boolean;
  onExportImage: () => void;
  onCheckRank: () => void;
  onClone: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  credits: Credits | null;
}

export const HeaderExportActions: React.FC<HeaderExportActionsProps> = ({
  isExporting,
  onExportImage,
  onCheckRank,
  onClone,
  onRefresh,
  isRefreshing,
  credits,
}) => {
  return (
    <div className="flex justify-end items-center mb-4">
      <div className="flex gap-2 items-center">
        {/* Credits Badge */}
        {credits && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 h-4 py-3">
            Available credits {credits.remainingCredit} / {credits.allowedCredit}
          </Badge>
        )}
        
        <Button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Button onClick={onClone} variant="outline" size="sm" className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          Clone
        </Button>
        
        <Button onClick={onCheckRank} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          Check Rank
        </Button>
        {/* <Button onClick={onExportImage} disabled={isExporting} size="sm" variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button> */}
      </div>
    </div>
  );
};
