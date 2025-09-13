import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, BarChart3 } from 'lucide-react';

export const TopHeader: React.FC = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[405] w-full px-4 py-3 border-b border-border bg-background"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="border-l border-border/30 pl-3 hidden md:block">
              <h1 className="text-md font-semibold text-foreground mb-0 p-0">Report Ranking</h1>
              <p className="text-sm text-muted-foreground mt-0 p-0">Professional Business Reports</p>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (window.location.href = "https://old.gmbbriefcase.com/login")}
            className="bg-card text-foreground border hover:bg-accent rounded-sm"
          >
            <span className="hidden md:block mr-2">Back to old version</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};