import React from "react";

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  return (
    <main className="flex-1 min-h-[90vh] w-full bg-background pt-32 md:pt-32 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
};
