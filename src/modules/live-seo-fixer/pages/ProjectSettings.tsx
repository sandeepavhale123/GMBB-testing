import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const ProjectSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Project Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure project-specific settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Project settings for ID: {projectId} will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
