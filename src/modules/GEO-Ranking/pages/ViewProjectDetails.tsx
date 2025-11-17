import React from "react";
import { useParams } from "react-router-dom";
import { GeoRankingPage } from "@/components/GeoRanking/GeoRankingPage";

const ViewProjectDetails: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();

  return (
    <GeoRankingPage
      projectId={project_id ? parseInt(project_id) : undefined}
      isProjectMode={true}
    />
  );
};

export default ViewProjectDetails;
