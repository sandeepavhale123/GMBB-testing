import React from "react";
import { TeamActivityLogs } from "@/components/TeamActivity";

export const ActivityWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Activity Logs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track team member actions and review replies
        </p>
      </div>
      <TeamActivityLogs />
    </div>
  );
};
