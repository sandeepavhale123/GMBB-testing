import React from 'react';

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          The GEO Ranking Dashboard is coming soon.
        </h1>
        <p className="text-lg text-muted-foreground">
          We're working hard to bring you this exciting new feature.
        </p>
      </div>
    </div>
  );
};