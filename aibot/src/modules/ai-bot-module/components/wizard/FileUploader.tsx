import React, { useCallback } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}

interface FileUploaderProps {
  files: UploadedFile[];
  isUploading: boolean;
  onUpload: (files: FileList) => void;
  onRemove: (fileId: string) => void;
  disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const StatusIcon: React.FC<{ status: UploadedFile['status'] }> = ({ status }) => {
  switch (status) {
    case 'uploading':
    case 'processing':
      return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
  }
};

const StatusText: React.FC<{ status: UploadedFile['status']; error?: string }> = ({ status, error }) => {
  switch (status) {
    case 'uploading':
      return <span className="text-xs text-muted-foreground">Uploading...</span>;
    case 'processing':
      return <span className="text-xs text-muted-foreground">Processing...</span>;
    case 'completed':
      return <span className="text-xs text-green-600">Ready</span>;
    case 'failed':
      return <span className="text-xs text-destructive">{error || 'Failed'}</span>;
  }
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  isUploading,
  onUpload,
  onRemove,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  }, [disabled, onUpload]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = '';
    }
  }, [onUpload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upload Files</CardTitle>
        <CardDescription>Upload PDF, TXT, or DOC files to train your bot</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".txt,.pdf,.doc,.docx"
            multiple
            onChange={handleFileChange}
            disabled={disabled}
          />
          <Upload className={cn(
            'w-10 h-10 mx-auto',
            isDragging ? 'text-primary' : 'text-muted-foreground'
          )} />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragging ? 'Drop files here' : 'Drag & drop files here or click to browse'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supported: PDF, TXT, DOC, DOCX (max 10MB)
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                      <StatusText status={file.status} error={file.error} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={file.status} />
                  {file.status !== 'uploading' && file.status !== 'processing' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(file.id);
                      }}
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <p className="text-sm text-muted-foreground text-center">
            Uploading files...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
