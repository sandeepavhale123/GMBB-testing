
import React from 'react';
import { Button } from '../ui/button';
import { RefreshCcw, Download, FileText } from 'lucide-react';
import { Badge } from '../ui/badge';

interface HeaderExportActionsProps {
  isExporting: boolean;
  onExportImage: () => void;
  onCheckRank: () => void;
  remainingCredit?: number;
  allowedCredit?: string;
}

export const HeaderExportActions: React.FC<HeaderExportActionsProps> = ({
  isExporting,
  onExportImage,
  onCheckRank,
  remainingCredit = 0,
  allowedCredit = "0"
}) => {
  return (
    <div className="mb-3 flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center justify-between">
      <div className="text-lg sm:text-xl font-semibold text-gray-900">
        GEO Ranking Report
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Credits Badge */}
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Credits: {remainingCredit} / {allowedCredit}
        </Badge>
        
        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCheckRank}
          className="flex items-center gap-1.5"
        >
          <RefreshCcw className="h-4 w-4" />
          Check Rank
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExportImage}
          disabled={isExporting}
          className="flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </div>
    </div>
  );
};
