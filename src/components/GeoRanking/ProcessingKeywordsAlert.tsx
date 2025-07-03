import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Clock } from 'lucide-react';

interface ProcessingKeywordsAlertProps {
  keywords: string[];
}

export const ProcessingKeywordsAlert: React.FC<ProcessingKeywordsAlertProps> = ({ keywords }) => {
  if (keywords.length === 0) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <AlertDescription className="text-blue-800 font-medium">
          Your keywords are in progress: <span className="font-semibold">{keywords.join(', ')}</span> - please wait
        </AlertDescription>
      </div>
    </Alert>
  );
};