import React from 'react';

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

export const StandaloneLayout: React.FC<StandaloneLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};