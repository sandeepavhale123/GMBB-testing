import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainBodyProps {
  children: React.ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <main className="flex-1 overflow-auto relative z-40" style={{ marginTop: "-100px" }}>
      <div className={`container mx-auto p-2 md:p-4 lg:p-8`}>
        {children}
      </div>
    </main>
  );
};