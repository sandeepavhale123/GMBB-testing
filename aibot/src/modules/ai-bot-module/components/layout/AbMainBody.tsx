import React from "react";

interface AbMainBodyProps {
  children: React.ReactNode;
}

export const AbMainBody: React.FC<AbMainBodyProps> = ({ children }) => {
  return (
    <main className="flex-1 min-h-[90vh] w-full bg-background pt-32 md:pt-32 lg:pt-32 pb-[100px] md:pb-[100px] lg:pb-[100px]">
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
};
