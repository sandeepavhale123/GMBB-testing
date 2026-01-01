import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AbWorkspaceRole } from '../../types/workspace';

interface AbMemberRoleSelectProps {
  value: AbWorkspaceRole;
  onChange: (role: AbWorkspaceRole) => void;
  disabled?: boolean;
  isOwner?: boolean;
}

export const AbMemberRoleSelect: React.FC<AbMemberRoleSelectProps> = ({
  value,
  onChange,
  disabled = false,
  isOwner = false,
}) => {
  if (isOwner) {
    return (
      <span className="px-2 py-1 text-sm bg-primary/10 text-primary rounded-md font-medium">
        Owner
      </span>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as AbWorkspaceRole)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
