import React from "react";
import { ManageGoogleAPIKey } from "@/modules/GEO-Ranking/pages/ManageGoogleAPIKey";

const GoogleApiKeyWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <ManageGoogleAPIKey />
      </div>
    </div>
  );
};

export default GoogleApiKeyWrapper;
