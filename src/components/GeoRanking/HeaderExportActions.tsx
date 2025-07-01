
import React from 'react';
import { Button } from '../ui/button';
import { Download, RefreshCcw, Copy } from 'lucide-react';

interface HeaderExportActionsProps {
  isExporting: boolean;
  onExportImage: () => void;
  onCheckRank: () => void;
}

export const HeaderExportActions: React.FC<HeaderExportActionsProps> = ({
  isExporting,
  onExportImage,
  onCheckRank,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* Export Button - Always on the left */}
      <Button onClick={onExportImage} disabled={isExporting} size="sm" variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export Report'}
      </Button>

      {/* Action Buttons - Show on top right for screens < 1300px */}
      <div className="flex gap-2 2xl:hidden">
        <Button onClick={onCheckRank} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          Check Rank
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
