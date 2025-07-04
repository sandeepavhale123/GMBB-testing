import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ListingSetupData } from '../../types/setupTypes';

interface SetupComponentProps {
  setupData: ListingSetupData;
  isLoading?: boolean;
}

const SETUP_MODULES = [
  {
    key: 'reviewData' as keyof ListingSetupData,
    label: 'Reviews'
  },
  {
    key: 'qaData' as keyof ListingSetupData,
    label: 'Questions'
  },
  {
    key: 'insightData' as keyof ListingSetupData,
    label: 'Metrics'
  },
  {
    key: 'gmbInfo' as keyof ListingSetupData,
    label: 'Locations'
  },
  {
    key: 'postData' as keyof ListingSetupData,
    label: 'Posts'
  },
  {
    key: 'mediaData' as keyof ListingSetupData,
    label: 'Media'
  }
];

export const SetupComponent: React.FC<SetupComponentProps> = ({ setupData, isLoading }) => {
  const getModuleStatus = (value: number): 'complete' | 'processing' | 'failed' => {
    if (value === 1) return 'complete';
    if (value === 0) return 'processing';
    return 'failed';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Please wait while we set up your account
          </h1>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-6">
            {SETUP_MODULES.map((module, index) => {
              const value = setupData[module.key];
              const status = getModuleStatus(value);
              
              return (
                <div key={module.key} className="relative flex items-center">
                  {/* Timeline dot/icon */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white">
                    {status === 'complete' ? (
                      <CheckCircle className="w-5 h-5 text-orange-500 fill-current" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    )}
                  </div>

                  {/* Timeline content */}
                  <div className="ml-4 flex items-center">
                    {status === 'processing' && (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin mr-2" />
                    )}
                    <span className="text-gray-700 font-medium">
                      {module.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};