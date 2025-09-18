import React from "react";
import { DualCTASection } from "./DualCTASection";

interface CTASectionProps {
  reportId: string;
  settings?: any;
  isPreview?: boolean;
}

export const CTASection: React.FC<CTASectionProps> = ({ reportId, isPreview = false }) => {
  return <DualCTASection reportId={reportId} isPreview={isPreview} />;
};