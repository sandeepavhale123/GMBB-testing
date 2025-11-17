import React from "react";
import TeamMembersPage from "@/components/Settings/TeamMembersPage";

const TeamMembersWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <div className="[&>div]:!p-0 [&>div]:!max-w-none [&>div]:!mx-0">
        <TeamMembersPage />
      </div>
    </div>
  );
};

export default TeamMembersWrapper;
