import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Loader2, Clock } from 'lucide-react';

interface ProcessingKeywordsAlertProps {
  keywords: string[];
  progress?: number;
  isPolling?: boolean;
}

export const ProcessingKeywordsAlert: React.FC<ProcessingKeywordsAlertProps> = ({ 
  keywords, 
  progress = 0, 
  isPolling = false 
}) => {
  if (keywords.length === 0) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <AlertDescription className="text-blue-800 font-medium">
            Your keywords are in progress: <span className="font-semibold">{keywords.join(', ')}</span> - please wait
          </AlertDescription>
        </div>
        {isPolling && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-700">
              <span>Processing keyword data...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </div>
    </Alert>
  );
};