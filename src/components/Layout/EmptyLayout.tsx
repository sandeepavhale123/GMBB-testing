import React from "react";
import { Toaster } from "../ui/toaster";

interface EmptyLayoutProps {
  children: React.ReactNode;
}

export const EmptyLayout: React.FC<EmptyLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
      <Toaster />
    </div>
  );
};