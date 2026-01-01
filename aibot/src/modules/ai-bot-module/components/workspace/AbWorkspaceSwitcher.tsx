import React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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

interface AbWorkspaceSwitcherProps {
  onCreateClick: () => void;
}

export const AbWorkspaceSwitcher: React.FC<AbWorkspaceSwitcherProps> = ({ onCreateClick }) => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useAbWorkspaceContext();

  const handleWorkspaceSelect = (workspace: AbWorkspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 px-3 gap-2"
        >
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
            {currentWorkspace?.name.charAt(0).toUpperCase() || 'W'}
          </div>
          <span className="truncate font-medium max-w-[120px] hidden sm:inline">
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="end">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
