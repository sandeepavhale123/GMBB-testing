import React from "react";
import { EditTeamMemberSettings } from "@/components/Settings/EditTeamMemberSettings";

const EditTeamMemberWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <EditTeamMemberSettings />
      </div>
    </div>
  );
};

export default EditTeamMemberWrapper;
