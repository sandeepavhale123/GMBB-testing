import React from 'react';
import { Check, ChevronsUpDown, Plus, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAbWorkspaceContext } from '../../context/AbWorkspaceContext';
import { AbWorkspace } from '../../types/workspace';
import { useNavigate } from 'react-router-dom';

interface AbWorkspaceSwitcherProps {
  onCreateClick: () => void;
}

export const AbWorkspaceSwitcher: React.FC<AbWorkspaceSwitcherProps> = ({ onCreateClick }) => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useAbWorkspaceContext();
  const navigate = useNavigate();

  const handleWorkspaceSelect = (workspace: AbWorkspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-3 py-2 h-auto"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {currentWorkspace?.name.charAt(0).toUpperCase() || 'W'}
            </div>
            <span className="truncate font-medium">
              {currentWorkspace?.name || 'Select Workspace'}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="start">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => handleWorkspaceSelect(workspace)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{workspace.name}</span>
            </div>
            {currentWorkspace?.id === workspace.id && (
              <Check className="h-4 w-4 shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/module/ai-bot/workspace/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Workspace Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/module/ai-bot/workspace/team')}>
          <Users className="h-4 w-4 mr-2" />
          Team Members
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
