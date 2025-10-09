import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlayCircle } from "lucide-react";
import type { Project } from "../types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge className={cn("capitalize", getStatusColor(project.status))}>
            {project.status}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <ExternalLink className="w-3 h-3" />
          <span className="truncate">{project.website}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Issues Found</p>
            <p className="text-2xl font-semibold text-foreground">{project.issues_found}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Issues Fixed</p>
            <p className="text-2xl font-semibold text-green-600">{project.issues_fixed}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/module/live-seo-fixer/projects/${project.id}`)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/module/live-seo-fixer/projects/${project.id}`)}
        >
          <PlayCircle className="w-4 h-4 mr-1" />
          Start Audit
        </Button>
      </CardFooter>
    </Card>
  );
};
