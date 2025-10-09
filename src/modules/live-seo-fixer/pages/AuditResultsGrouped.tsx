import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { projectService } from "@/services/liveSeoFixer/projectService";
import { Button } from "@/components/ui/button";

export const AuditResultsGrouped: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const auditId = searchParams.get("auditId");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["seo-audit-categories", projectId, auditId],
    queryFn: () => projectService.getAuditCategories(projectId!, auditId!),
    enabled: !!projectId && !!auditId,
  });

  if (isLoading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Results</h1>
        <p className="text-muted-foreground mt-1">Review and approve SEO fixes by category</p>
      </div>

      {categories?.map((category) => (
        <Card key={category.type}>
          <CardHeader>
            <CardTitle>{category.label} ({category.count})</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">View Issues</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
