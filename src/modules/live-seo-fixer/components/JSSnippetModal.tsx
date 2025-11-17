import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Loader2, X, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getJSCode } from "@/services/liveSeoFixer";
import { toast } from "@/hooks/use-toast";

interface JSSnippetModalProps {
  projectId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  successMode?: boolean;
  appliedCount?: number;
  wordPressConnected?: boolean;
}

export const JSSnippetModal: React.FC<JSSnippetModalProps> = ({
  projectId,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  successMode = false,
  appliedCount = 0,
  wordPressConnected = false,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const { data, isLoading, error } = useQuery({
    queryKey: ["js-code", projectId],
    queryFn: () => getJSCode(projectId),
    enabled: open,
  });

  const jsCode = data?.data;

  const copyToClipboard = () => {
    if (jsCode?.script_tag) {
      navigator.clipboard.writeText(jsCode.script_tag);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "JavaScript snippet copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">View JS Snippet</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          {successMode ? (
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  Fixes Applied Successfully!
                </DialogTitle>
                <DialogDescription>
                  {appliedCount} SEO{" "}
                  {appliedCount === 1 ? "fix has" : "fixes have"} been approved
                  and prepared for deployment
                </DialogDescription>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                JavaScript Integration
                {jsCode?.project_name && (
                  <Badge variant="secondary">{jsCode.project_name}</Badge>
                )}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          )}
          {!successMode && (
            <DialogDescription>
              Add this JavaScript snippet to your website's &lt;head&gt; section
              to enable live SEO fixes. The snippet is lightweight and will only
              apply approved fixes.
            </DialogDescription>
          )}
        </DialogHeader>

        {successMode && appliedCount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Fixes Ready for Deployment
                </p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {appliedCount}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
        )}

        {/* WordPress Sync Info */}
        {successMode && wordPressConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  WordPress Integration Active
                </h4>
                <p className="text-sm text-green-700">
                  Your approved SEO fixes have been automatically sent to your
                  WordPress website and will be applied automatically. No
                  additional steps required!
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Failed to load JavaScript code. Please try again.
          </div>
        ) : jsCode ? (
          <div className="space-y-4">
            {successMode && !wordPressConnected && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Next Step: Install JavaScript Snippet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To activate these fixes on your live website, add the
                  following JavaScript snippet to your website's{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    &lt;head&gt;
                  </code>{" "}
                  section.
                </p>
              </div>
            )}

            {/* Snippet Code - Only show if not WordPress connected in success mode */}
            {(!successMode || !wordPressConnected) && (
              <>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-48">
                    <code>{jsCode.script_tag}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                {/* Installation Instructions */}
                {jsCode.instructions && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Installation Instructions:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          1
                        </span>
                        <span>{jsCode.instructions.step_1}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          2
                        </span>
                        <span>{jsCode.instructions.step_2}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          3
                        </span>
                        <span>{jsCode.instructions.step_3}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          4
                        </span>
                        <span>{jsCode.instructions.step_4}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {jsCode.notes && jsCode.notes.length > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Important Notes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {jsCode.notes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
