import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const PageAudit: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Page Audit Details</h1>
        <p className="text-muted-foreground mt-1">
          View detailed audit information for this page
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Page audit details for project {projectId}, page {pageId} will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
