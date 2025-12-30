import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-center text-sm text-muted-foreground">
          {/* © 2024 GMB Briefcase. All rights reserved. */}
        </div>
      </div>
    </footer>
  );
};