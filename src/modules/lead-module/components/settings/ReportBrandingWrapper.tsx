import React from "react";
import { ReportBrandingPage } from "@/components/Settings/ReportBrandingPage";

const ReportBrandingWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <ReportBrandingPage />
      </div>
    </div>
  );
};

export default ReportBrandingWrapper;
