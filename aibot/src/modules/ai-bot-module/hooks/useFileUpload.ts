import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
  source_id?: string;
}

const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPABASE_URL = 'https://uuamwkahckzufscqkviz.supabase.co';

export const useFileUpload = (botId?: string, projectId?: string) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File too large. Maximum size is 10MB';
    }
    
    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!botId) {
      toast.error('Bot ID is required');
      return null;
    }

    console.log('[useFileUpload] Starting upload for file:', file.name, 'botId:', botId);

    const validationError = validateFile(file);
    if (validationError) {
      console.log('[useFileUpload] Validation failed:', validationError);
      toast.error(validationError);
      return null;
    }

    const fileId = `${Date.now()}-${file.name}`;
    
    // Add file to state with uploading status
    setFiles(prev => [...prev, {
      id: fileId,
      name: file.name,
      size: file.size,
      status: 'uploading',
    }]);

    setIsUploading(true);

    try {
      // Get current session for auth
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      console.log('[useFileUpload] Got session, has token:', !!accessToken);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bot_id', botId);
      if (projectId) {
        formData.append('project_id', projectId);
      }

      // Use fetch directly for FormData - supabase.functions.invoke doesn't handle FormData well
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-bot-upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken || ''}`,
        },
        body: formData,
      });

      console.log('[useFileUpload] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useFileUpload] Upload error response:', errorText);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'failed', error: errorText } : f
        ));
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }

      const data = await response.json();
      console.log('[useFileUpload] Upload successful, response:', data);

      if (data.error) {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'failed', error: data.error } : f
        ));
        toast.error(`Failed to upload ${file.name}: ${data.error}`);
        return null;
      }

      // Update file status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'processing', source_id: data.source_id } : f
      ));

      // Poll for completion
      const sourceId = data.source_id;
      if (sourceId) {
        const checkStatus = async () => {
          const { data: source } = await supabase
            .from('ab_knowledge_sources')
            .select('status, error_message')
            .eq('id', sourceId)
            .maybeSingle();

          console.log('[useFileUpload] Poll status:', source?.status);

          if (source) {
            if (source.status === 'completed') {
              setFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, status: 'completed' } : f
              ));
              toast.success(`${file.name} processed successfully`);
            } else if (source.status === 'failed') {
              setFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, status: 'failed', error: source.error_message || 'Processing failed' } : f
              ));
              toast.error(`Failed to process ${file.name}`);
            } else if (source.status === 'pending' || source.status === 'processing') {
              // Keep polling
              setTimeout(checkStatus, 2000);
            }
          }
        };

        // Start polling after a short delay
        setTimeout(checkStatus, 2000);
      }

      return data;
    } catch (error) {
      console.error('[useFileUpload] Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'failed', error: 'Upload failed' } : f
      ));
      toast.error(`Failed to upload ${file.name}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [botId, projectId]);

  // Upload file for a specific bot (used when bot is created after files are queued)
  const uploadFileForBot = useCallback(async (file: File, targetBotId: string) => {
    console.log('[useFileUpload] uploadFileForBot for:', file.name, 'targetBotId:', targetBotId);

    const validationError = validateFile(file);
    if (validationError) {
      console.log('[useFileUpload] Validation failed:', validationError);
      toast.error(validationError);
      return null;
    }

    try {
      // Get current session for auth
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      console.log('[useFileUpload] Got session for uploadFileForBot, has token:', !!accessToken);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bot_id', targetBotId);

      // Use fetch directly for FormData
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-bot-upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken || ''}`,
        },
        body: formData,
      });

      console.log('[useFileUpload] uploadFileForBot response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useFileUpload] uploadFileForBot error response:', errorText);
        return null;
      }

      const data = await response.json();
      console.log('[useFileUpload] uploadFileForBot successful, response:', data);

      if (data.error) {
        console.error('[useFileUpload] uploadFileForBot error:', data.error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[useFileUpload] uploadFileForBot error:', error);
      return null;
    }
  }, []);

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    for (const file of filesArray) {
      await uploadFile(file);
    }
  }, [uploadFile]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    isUploading,
    uploadFile,
    uploadFileForBot,
    uploadFiles,
    removeFile,
    clearFiles,
    validateFile,
  };
};
