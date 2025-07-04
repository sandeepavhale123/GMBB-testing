import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { CircularProgress } from '../ui/circular-progress';
import { CheckCircle, Clock, AlertCircle, Database, MessageSquare, BarChart3, HelpCircle, FileText, Image } from 'lucide-react';
import { ListingSetupData, SetupModule, SetupProgress } from '../../types/setupTypes';
import { cn } from '../../lib/utils';
interface SetupComponentProps {
  setupData: ListingSetupData;
  isLoading?: boolean;
}
const SETUP_MODULES: Omit<SetupModule, 'status'>[] = [{
  key: 'gmbInfo',
  label: 'GMB Info',
  description: 'Setting up Google My Business profile data'
}, {
  key: 'reviewData',
  label: 'Reviews',
  description: 'Importing review data and analytics'
}, {
  key: 'insightData',
  label: 'Insights',
  description: 'Processing performance insights'
}, {
  key: 'qaData',
  label: 'Q&A',
  description: 'Loading questions and answers'
}, {
  key: 'postData',
  label: 'Posts',
  description: 'Syncing post content and media'
}, {
  key: 'mediaData',
  label: 'Media',
  description: 'Processing images and media files'
}];
const MODULE_ICONS = {
  gmbInfo: Database,
  reviewData: MessageSquare,
  insightData: BarChart3,
  qaData: HelpCircle,
  postData: FileText,
  mediaData: Image
};
export const SetupComponent: React.FC<SetupComponentProps> = ({
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
      percentage: Math.round(completed / total * 100),
      isComplete: completed === total
    };
  };
  const getModuleStatus = (value: number): 'complete' | 'processing' | 'failed' => {
    if (value === 1) return 'complete';
    if (value === 0) return 'processing';
    return 'failed';
  };
  const progress = getSetupProgress();
  const StatusIcon = ({
    status
  }: {
    status: 'complete' | 'processing' | 'failed';
  }) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };
  return <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        
        
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Setup Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <CircularProgress value={progress.percentage} size={120} strokeWidth={8} className="text-blue-500">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900">
                  {progress.percentage}%
                </span>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </CircularProgress>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{progress.completed} of {progress.total} modules complete</span>
              <span>
                {progress.isComplete ? 'All done!' : `${progress.total - progress.completed} remaining`}
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Module Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SETUP_MODULES.map(module => {
        const value = setupData[module.key];
        const status = getModuleStatus(value);
        const Icon = MODULE_ICONS[module.key];
        return <Card key={module.key} className={cn("transition-all duration-200", status === 'complete' && "bg-green-50 border-green-200", status === 'processing' && "bg-blue-50 border-blue-200", status === 'failed' && "bg-red-50 border-red-200")}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-sm font-semibold">
                      {module.label}
                    </CardTitle>
                  </div>
                  <StatusIcon status={status} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {status === 'complete' && 'Setup complete ✅'}
                  {status === 'processing' && `${module.description}...`}
                  {status === 'failed' && 'Setup failed - please try again'}
                </p>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Auto-refresh indicator */}
      

      {/* Loading state */}
      {isLoading && <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <CircularProgress size={20} strokeWidth={2} value={50} className="animate-spin" />
            <span className="text-sm">Checking setup status...</span>
          </div>
        </div>}
    </div>;
};