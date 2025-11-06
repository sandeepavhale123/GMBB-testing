import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { FormSchema } from '../../types/formBuilder.types';

interface JsonPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: Partial<FormSchema>;
}

export const JsonPreviewDialog: React.FC<JsonPreviewDialogProps> = ({
  open,
  onOpenChange,
  schema,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const json = JSON.stringify(schema, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    toast.success('JSON schema copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Form JSON Schema</DialogTitle>
          <DialogDescription>
            Copy this JSON schema to use in your application
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative flex-1 overflow-hidden">
          <pre className="bg-muted p-4 rounded-lg overflow-auto h-full text-xs font-mono">
            {JSON.stringify(schema, null, 2)}
          </pre>
          
          <Button
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
