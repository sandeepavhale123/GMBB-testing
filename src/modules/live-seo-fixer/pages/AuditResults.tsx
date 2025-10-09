import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const AuditResults: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Results</h1>
        <p className="text-muted-foreground mt-1">
          View and manage SEO audit results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Audit results for project {projectId} will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
