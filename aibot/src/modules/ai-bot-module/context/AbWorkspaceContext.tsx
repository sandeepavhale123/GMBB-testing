import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AbWorkspace, AbWorkspaceRole } from '../types/workspace';
import { toast } from 'sonner';

interface AbWorkspaceContextValue {
  workspaces: AbWorkspace[];
  currentWorkspace: AbWorkspace | null;
  currentRole: AbWorkspaceRole | null;
  isLoading: boolean;
  setCurrentWorkspace: (workspace: AbWorkspace) => void;
  refreshWorkspaces: () => Promise<void>;
}

const AbWorkspaceContext = createContext<AbWorkspaceContextValue | undefined>(undefined);

const STORAGE_KEY = 'ab_current_workspace_id';

interface AbWorkspaceProviderProps {
  children: ReactNode;
}

export const AbWorkspaceProvider: React.FC<AbWorkspaceProviderProps> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<AbWorkspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<AbWorkspace | null>(null);
  const [currentRole, setCurrentRole] = useState<AbWorkspaceRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWorkspaces([]);
        setCurrentWorkspaceState(null);
        setCurrentRole(null);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('ab_workspaces')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const workspaceList = (data || []) as AbWorkspace[];

      // If no workspaces exist, create a default one
      if (workspaceList.length === 0) {
        const slug = `workspace-${Date.now()}`;
        const { data: newWorkspace, error: createError } = await supabase
          .from('ab_workspaces')
          .insert({
            name: 'My Workspace',
            slug,
            owner_id: user.id,
          })
          .select()
          .single();

        if (createError) throw createError;

        workspaceList.push(newWorkspace as AbWorkspace);
        
        // Migrate existing bots to the new workspace
        await supabase
          .from('ab_bots')
          .update({ workspace_id: newWorkspace.id })
          .eq('owner_id', user.id)
          .is('workspace_id', null);
      }

      setWorkspaces(workspaceList);

      // Restore selected workspace from localStorage or use first
      const storedId = localStorage.getItem(STORAGE_KEY);
      const restoredWorkspace = workspaceList.find(w => w.id === storedId) || workspaceList[0];
      
      if (restoredWorkspace) {
        setCurrentWorkspaceState(restoredWorkspace);
        
        // Determine role
        if (restoredWorkspace.owner_id === user.id) {
          setCurrentRole('owner');
        } else {
          const { data: memberData } = await supabase
            .from('ab_workspace_members')
            .select('role')
            .eq('workspace_id', restoredWorkspace.id)
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();
          
          setCurrentRole((memberData?.role as AbWorkspaceRole) || null);
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCurrentWorkspace = useCallback(async (workspace: AbWorkspace) => {
    setCurrentWorkspaceState(workspace);
    localStorage.setItem(STORAGE_KEY, workspace.id);

    // Update role for the new workspace
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (workspace.owner_id === user.id) {
        setCurrentRole('owner');
      } else {
        const { data: memberData } = await supabase
          .from('ab_workspace_members')
          .select('role')
          .eq('workspace_id', workspace.id)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        
        setCurrentRole((memberData?.role as AbWorkspaceRole) || null);
      }
    }
  }, []);

  const refreshWorkspaces = useCallback(async () => {
    await fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <AbWorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        currentRole,
        isLoading,
        setCurrentWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </AbWorkspaceContext.Provider>
  );
};

export function useAbWorkspaceContext() {
  const context = useContext(AbWorkspaceContext);
  if (!context) {
    throw new Error('useAbWorkspaceContext must be used within AbWorkspaceProvider');
  }
  return context;
}
