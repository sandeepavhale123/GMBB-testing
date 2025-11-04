import React from "react";

interface MapCreatorMainBodyProps {
  children: React.ReactNode;
}

export const MapCreatorMainBody: React.FC<MapCreatorMainBodyProps> = ({
  children,
}) => {
  return (
    <main className="w-full min-h-screen pt-20 px-4 md:px-6 pb-8">
      <div className="container mx-auto py-6 max-w-7xl">
        {children}
      </div>
    </main>
  );
};
