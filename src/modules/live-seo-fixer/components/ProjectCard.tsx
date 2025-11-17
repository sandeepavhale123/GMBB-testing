import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Settings, Play, Pause, Trash2 } from "lucide-react";
import { Project } from "../types/Project";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onToggleStatus?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status: Project["status"]) => {
    return status === "active" ? <Pause size={16} /> : <Play size={16} />;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {project.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="truncate">{project.website}</span>
              <ExternalLink
                size={14}
                className="text-muted-foreground flex-shrink-0"
              />
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              className={`${getStatusColor(project.status)} capitalize`}
              variant="secondary"
            >
              {project.status}
            </Badge>

            {/* WordPress Badge */}
            {project.wordpress_connection?.connected &&
              project.wordpress_connection?.wordpress_url && (
                <Badge
                  className="bg-blue-100 text-blue-800 flex items-center gap-1"
                  variant="secondary"
                >
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.158 12.786L9.042 20.26a9.94 9.94 0 003.916.782c1.647 0 3.175-.4 4.53-1.105a2.88 2.88 0 00-.098-.14l-5.232-7.01zM3.008 12c0 3.023 1.507 5.697 3.806 7.308L4.236 8.48A8.957 8.957 0 003.008 12zm14.27-3.67a5.28 5.28 0 01-.45 2.288c-.276.614-.634 1.138-.634 1.76 0 .682.52 1.316 1.256 1.316.034 0 .065-.004.098-.006a8.982 8.982 0 00-6.54-2.83 8.937 8.937 0 00-4.533 1.218c.122.003.244.005.366.005.594 0 1.516-.072 1.516-.072.307-.018.343.432.036.468 0 0-.31.037-.654.053l2.08 6.186 1.247-3.742-1.235-3.444a14.93 14.93 0 01-.653-.053c-.308-.035-.272-.486.035-.468 0 0 .946.072 1.508.072.594 0 1.516-.072 1.516-.072.307-.018.343.432.036.468 0 0-.31.037-.654.053l2.065 6.142 1.226-3.652a4.82 4.82 0 00.634-2.288c0-.828-.3-1.403-.553-1.848-.34-.554-.66-1.023-.66-1.578 0-.618.47-1.193 1.132-1.193.03 0 .058.003.087.006a8.962 8.962 0 00-5.375-1.766c-3.45 0-6.482 1.933-8.02 4.783.225.007.438.01.618.01.594 0 1.516-.072 1.516-.072.307-.018.343.432.036.468 0 0-.31.037-.654.053l2.08 6.186.888-2.665z" />
                  </svg>
                  WP
                </Badge>
              )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Issues Found:</span>
            <p className="font-medium text-destructive">
              {parseInt(project.issues_found)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Issues Fixed:</span>
            <p className="font-medium text-green-600">
              {parseInt(project.issues_fixed)}
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Created: {new Date(project.created_date).toLocaleDateString()}</p>
          <p>Updated: {new Date(project.last_updated).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(project)}
            className="flex-1"
          >
            <Settings size={16} className="mr-2" />
            Manage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus?.(project)}
            className="px-3"
          >
            {getStatusIcon(project.status)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(project)}
            className="px-3 text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
