import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Settings, Play, Pause, Trash2 } from 'lucide-react';
import { Project } from '../types/Project';

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
  onDelete
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    return status === 'active' ? <Pause size={16} /> : <Play size={16} />;
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
              <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
            </CardDescription>
          </div>
          <Badge 
            className={`${getStatusColor(project.status)} capitalize`}
            variant="secondary"
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Issues Found:</span>
            <p className="font-medium text-destructive">{parseInt(project.issues_found)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Issues Fixed:</span>
            <p className="font-medium text-green-600">{parseInt(project.issues_fixed)}</p>
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