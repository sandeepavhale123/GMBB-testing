import React from "react";

interface MapCreatorMainBodyProps {
  children: React.ReactNode;
}

export const MapCreatorMainBody: React.FC<MapCreatorMainBodyProps> = ({
  children,
}) => {
  return (
    <main className="pt-[128px] min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        {children}
      </div>
    </main>
  );
};
