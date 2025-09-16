import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { Button } from '../ui/button';

interface ReportsEmptyStateProps {
  onRefresh?: () => void;
}

export const ReportsEmptyState: React.FC<ReportsEmptyStateProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
        <Clock className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">Reports Not Generated Yet</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        Your reports are being generated. This may take a few minutes. Please try again later.
      </p>
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline">
          <FileText className="w-4 h-4 mr-1" />
          Try Again
        </Button>
      )}
    </div>
  );
};