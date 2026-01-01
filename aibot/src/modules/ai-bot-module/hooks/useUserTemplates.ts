import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemTemplate, SYSTEM_TEMPLATES } from '../types';
import { toast } from 'sonner';

interface UseUserTemplatesReturn {
  templates: SystemTemplate[];
  loading: boolean;
  error: string | null;
  createTemplate: (projectId: string, template: Omit<SystemTemplate, 'id' | 'project_id' | 'isBuiltIn'>) => Promise<SystemTemplate | null>;
  updateTemplate: (templateId: string, template: Partial<SystemTemplate>) => Promise<boolean>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useUserTemplates = (projectId?: string): UseUserTemplatesReturn => {
  const [userTemplates, setUserTemplates] = useState<SystemTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ab_system_templates')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedTemplates: SystemTemplate[] = (data || []).map((t) => ({
        id: t.id,
        project_id: t.project_id,
        name: t.name,
        systemMessage: t.system_message,
        userMessageTemplate: t.user_message_template || 'Context:\n{context}\n\nUser Question:\n{question}',
        description: t.description || '',
        isDefault: t.is_default,
        isBuiltIn: false,
      }));

      setUserTemplates(mappedTemplates);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch templates';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(
    async (
      projId: string,
      template: Omit<SystemTemplate, 'id' | 'project_id' | 'isBuiltIn'>
    ): Promise<SystemTemplate | null> => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: insertError } = await supabase
          .from('ab_system_templates')
          .insert({
            project_id: projId,
            name: template.name,
            system_message: template.systemMessage,
            user_message_template: template.userMessageTemplate,
            description: template.description,
            is_default: template.isDefault || false,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const newTemplate: SystemTemplate = {
          id: data.id,
          project_id: data.project_id,
          name: data.name,
          systemMessage: data.system_message,
          userMessageTemplate: data.user_message_template || 'Context:\n{context}\n\nUser Question:\n{question}',
          description: data.description || '',
          isDefault: data.is_default,
          isBuiltIn: false,
        };

        setUserTemplates((prev) => [newTemplate, ...prev]);
        toast.success('Template saved successfully!');
        return newTemplate;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create template';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateTemplate = useCallback(
    async (templateId: string, template: Partial<SystemTemplate>): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const updateData: Record<string, unknown> = {};
        if (template.name !== undefined) updateData.name = template.name;
        if (template.systemMessage !== undefined) updateData.system_message = template.systemMessage;
        if (template.userMessageTemplate !== undefined) updateData.user_message_template = template.userMessageTemplate;
        if (template.description !== undefined) updateData.description = template.description;
        if (template.isDefault !== undefined) updateData.is_default = template.isDefault;

        const { error: updateError } = await supabase
          .from('ab_system_templates')
          .update(updateData)
          .eq('id', templateId);

        if (updateError) throw updateError;

        setUserTemplates((prev) =>
          prev.map((t) => (t.id === templateId ? { ...t, ...template } : t))
        );
        toast.success('Template updated successfully!');
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update template';
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteTemplate = useCallback(async (templateId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('ab_system_templates')
        .delete()
        .eq('id', templateId);

      if (deleteError) throw deleteError;

      setUserTemplates((prev) => prev.filter((t) => t.id !== templateId));
      toast.success('Template deleted successfully!');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete template';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Combine built-in templates with user templates
  const allTemplates = [...SYSTEM_TEMPLATES, ...userTemplates];

  return {
    templates: allTemplates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
};
