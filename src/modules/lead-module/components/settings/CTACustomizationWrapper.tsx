import React from 'react';

export const CTACustomizationWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CTA Customization</h1>
          <p className="text-muted-foreground">Customize your call-to-action buttons and settings.</p>
        </div>
        
        <div className="bg-muted/50 border border-dashed border-border rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">CTA Customization Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              This feature is currently under development. You'll be able to customize your call-to-action buttons, 
              colors, text, and positioning here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};