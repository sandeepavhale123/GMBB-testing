import { isAllowedDomain } from '@/lib/utils';
import React from 'react';

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <img src="lovable-uploads/coming-soon.png" alt="" style={{ margin: "10px auto" }} />
        <h1 className="text-4xl font-bold text-foreground">
          The GEO Ranking Dashboard is coming soon.
        </h1>
        <p className="text-lg text-muted-foreground">
          We're working hard to bring you this exciting new feature.
        </p>
        {
          isAllowedDomain() && (
            <button
              onClick={() => window.location.href = 'https://old.gmbbriefcase.com/login'}
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Back to old version
            </button>
          )
        }
      </div>
    </div>
  );
};