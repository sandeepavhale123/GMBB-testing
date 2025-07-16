import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Loader2, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProcessingKeywordsAlertProps {
  keywords: string[];
  progress?: number;
  isPolling?: boolean;
  submittedKeywords?: string[];
  isNewSubmission?: boolean;
}

export const ProcessingKeywordsAlert: React.FC<ProcessingKeywordsAlertProps> = ({ 
  keywords, 
  progress = 0, 
  isPolling = false,
  submittedKeywords = [],
  isNewSubmission = false
}) => {
  const navigate = useNavigate();
  
  // Combine all processing keywords
  const allProcessingKeywords = [...new Set([...submittedKeywords, ...keywords])];
  
  if (allProcessingKeywords.length === 0) return null;

  // Determine if we have newly submitted keywords vs already processing ones
  const newlySubmittedCount = submittedKeywords.length;
  const alreadyProcessingCount = keywords.filter(k => !submittedKeywords.includes(k)).length;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isNewSubmission ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <AlertDescription className="text-blue-800 font-medium">
                {isNewSubmission && newlySubmittedCount > 0 ? (
                  <span>
                    <span className="text-green-700 font-semibold">
                      {newlySubmittedCount} keyword{newlySubmittedCount > 1 ? 's' : ''} submitted successfully!
                    </span>
                    {alreadyProcessingCount > 0 && (
                      <span className="text-blue-700">
                        {' '}+ {alreadyProcessingCount} already processing
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    Your keywords are in progress: <span className="font-semibold">{allProcessingKeywords.join(', ')}</span> - please wait
                  </span>
                )}
              </AlertDescription>
              {isNewSubmission && (
                <p className="text-sm text-blue-600 mt-1">
                  Processing will take a few minutes. Results will appear automatically.
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => navigate('/geo-ranking-report')}
            className="text-sm text-blue-600 hover:text-blue-800 underline whitespace-nowrap ml-4"
          >
            Back to Report Form
          </button>
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
        
        {/* Show breakdown of keywords if both types exist */}
        {newlySubmittedCount > 0 && alreadyProcessingCount > 0 && (
          <div className="pt-2 border-t border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-green-700 font-medium">Newly submitted:</span>
                <div className="text-green-600">{submittedKeywords.join(', ')}</div>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Already processing:</span>
                <div className="text-blue-600">{keywords.filter(k => !submittedKeywords.includes(k)).join(', ')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Alert>
  );
};