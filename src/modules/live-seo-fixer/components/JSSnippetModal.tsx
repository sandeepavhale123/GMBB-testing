import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Code } from "lucide-react";
import { toast } from "sonner";

interface JSSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsCode: string;
  appliedFixesCount?: number;
}

export const JSSnippetModal: React.FC<JSSnippetModalProps> = ({
  isOpen,
  onClose,
  jsCode,
  appliedFixesCount,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsCode);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            JavaScript Integration Snippet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {appliedFixesCount !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  Successfully approved {appliedFixesCount} fix{appliedFixesCount !== 1 ? "es" : ""}
                </span>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Installation Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Copy the JavaScript code below</li>
              <li>Paste it before the closing &lt;/head&gt; tag on your website</li>
              <li>The fixes will be applied automatically to your pages</li>
            </ol>
          </div>

          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
              <code>{jsCode}</code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> This snippet is unique to your project. Keep it secure and don't share it publicly.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
