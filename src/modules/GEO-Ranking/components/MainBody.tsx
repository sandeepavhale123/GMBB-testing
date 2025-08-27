import React from "react";

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  return (
    <main className="flex-1 min-h-[90vh] w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
};