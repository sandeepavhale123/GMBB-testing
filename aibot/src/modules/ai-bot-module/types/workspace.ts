export type AbWorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type AbMemberStatus = 'pending' | 'active';

export interface AbWorkspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbWorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string | null;
  email: string;
  role: AbWorkspaceRole;
  status: AbMemberStatus;
  invited_by: string | null;
  invited_at: string;
  joined_at: string | null;
  created_at: string;
}

export interface AbWorkspaceWithRole extends AbWorkspace {
  userRole: AbWorkspaceRole;
}

// Permission helpers
export const ROLE_HIERARCHY: Record<AbWorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function hasMinimumRole(userRole: AbWorkspaceRole, requiredRole: AbWorkspaceRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canEditBots(role: AbWorkspaceRole): boolean {
  return hasMinimumRole(role, 'editor');
}

export function canDeleteBots(role: AbWorkspaceRole): boolean {
  return hasMinimumRole(role, 'admin');
}

export function canManageTeam(role: AbWorkspaceRole): boolean {
  return hasMinimumRole(role, 'admin');
}

export function canEditWorkspace(role: AbWorkspaceRole): boolean {
  return hasMinimumRole(role, 'admin');
}

export function canDeleteWorkspace(role: AbWorkspaceRole): boolean {
  return role === 'owner';
}
