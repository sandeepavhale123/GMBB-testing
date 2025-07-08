import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { CircularProgress } from '../ui/circular-progress';
import { CheckCircle, Database, MessageSquare, BarChart3, HelpCircle, FileText, Image, Loader2 } from 'lucide-react';
import { ListingSetupData, SetupModule, SetupProgress } from '../../types/setupTypes';
import { cn } from '../../lib/utils';

interface SetupProgressAlertProps {
  setupData: ListingSetupData;
  isLoading?: boolean;
}

const SETUP_MODULES: Omit<SetupModule, 'status'>[] = [
  {
    key: 'gmbInfo',
    label: 'GMB Info',
    description: 'Setting up Google My Business profile data'
  },
  {
    key: 'reviewData',
    label: 'Reviews',
    description: 'Importing review data and analytics'
  },
  {
    key: 'insightData',
    label: 'Insights',
    description: 'Processing performance insights'
  },
  {
    key: 'qaData',
    label: 'Q&A',
    description: 'Loading questions and answers'
  },
  {
    key: 'postData',
    label: 'Posts',
    description: 'Syncing post content and media'
  },
  {
    key: 'mediaData',
    label: 'Media',
    description: 'Processing images and media files'
  }
];

const MODULE_ICONS = {
  gmbInfo: Database,
  reviewData: MessageSquare,
  insightData: BarChart3,
  qaData: HelpCircle,
  postData: FileText,
  mediaData: Image
};

export const SetupProgressAlert: React.FC<SetupProgressAlertProps> = ({
  setupData,
  isLoading
}) => {
  const getSetupProgress = (): SetupProgress => {
    const values = Object.values(setupData);
    const completed = values.filter(value => value === 1).length;
    const total = values.length;
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
      isComplete: completed === total
    };
  };

  const getModuleStatus = (value: number): 'complete' | 'processing' | 'failed' => {
    if (value === 1) return 'complete';
    if (value === 0) return 'processing';
    return 'failed';
  };

  const progress = getSetupProgress();

  const StatusIcon = ({ status }: { status: 'complete' | 'processing' | 'failed' }) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <CheckCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Alert className="bg-blue-50 border-blue-200 mb-6">
      <AlertDescription>
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Message and modules */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="text-sm font-medium text-gray-900">
                We're preparing your business data. This usually takes a few minutes.
              </div>
              
              {/* Modules in a single row */}
              <div className="flex items-center gap-3 flex-wrap">
                {SETUP_MODULES.map(module => {
                  const value = setupData[module.key];
                  const status = getModuleStatus(value);
                  const Icon = MODULE_ICONS[module.key];
                  
                  return (
                    <div 
                      key={module.key} 
                      className="flex items-center gap-1.5 text-xs text-gray-600"
                    >
                      <Icon className="w-3 h-3" />
                      <span>{module.label}</span>
                      <StatusIcon status={status} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side - Circular progress */}
          <div className="flex-shrink-0">
            <CircularProgress
              value={progress.percentage}
              size={60}
              strokeWidth={4}
              className="text-blue-500"
            >
              <div className="text-center">
                <span className="text-sm font-bold text-gray-900">
                  {progress.percentage}%
                </span>
              </div>
            </CircularProgress>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};