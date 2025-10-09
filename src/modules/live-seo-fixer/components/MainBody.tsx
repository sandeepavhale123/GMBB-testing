import React from "react";

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  return (
    <main className="flex-1 p-6 pt-32 max-w-7xl mx-auto w-full">
      {children}
    </main>
  );
};
