import React from 'react';

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">
                GEO Ranking Dashboard
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Reports
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </a>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h5v14z" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            The GEO Ranking Dashboard is coming soon.
          </h1>
          <p className="text-lg text-muted-foreground">
            We're working hard to bring you this exciting new feature.
          </p>
          <button
            onClick={() => window.location.href = 'https://old.gmbbriefcase.com/login'}
            className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Back to Old version
          </button>
        </div>
      </div>
    </div>
  );
};