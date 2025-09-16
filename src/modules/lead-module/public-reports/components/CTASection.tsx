import React from "react";
import { DualCTASection } from "./DualCTASection";

interface CTASectionProps {
  settings?: any;
  isPreview?: boolean;
}

export const CTASection: React.FC<CTASectionProps> = ({ isPreview = false }) => {
  return <DualCTASection isPreview={isPreview} />;
};