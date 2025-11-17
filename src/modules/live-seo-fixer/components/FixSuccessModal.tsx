import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FixSuccessModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  appliedCount: number;
  jsSnippet?: string;
  wordPressConnected?: boolean;
}

const FixSuccessModal: React.FC<FixSuccessModalProps> = ({
  open,
  onClose,
  projectId,
  appliedCount,
  jsSnippet,
  wordPressConnected = false,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (jsSnippet) {
      navigator.clipboard.writeText(jsSnippet);
      setCopied(true);
      toast.success("JavaScript snippet copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewProject = () => {
    onClose();
    navigate(`/module/live-seo-fixer/projects/${projectId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
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
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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

          {/* WordPress Sync Info */}
          {wordPressConnected && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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

          {/* JS Snippet Section */}
          {jsSnippet && !wordPressConnected && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Next Step: Install JavaScript Snippet
                </h3>
                <p className="text-sm text-muted-foreground">
                  To activate these fixes on your live website, add the
                  following JavaScript snippet to your website's{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    &lt;head&gt;
                  </code>{" "}
                  section.
                </p>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono border">
                  {jsSnippet}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Installation Instructions:
                </h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Copy the JavaScript snippet above</li>
                  <li>
                    Paste it into your website's{" "}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">
                      &lt;head&gt;
                    </code>{" "}
                    section
                  </li>
                  <li>Save and publish your changes</li>
                  <li>Refresh your website to see the SEO fixes take effect</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  ⚠️ Important Notes:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>
                    The snippet must be present in the{" "}
                    <code className="bg-yellow-100 px-1 py-0.5 rounded">
                      &lt;head&gt;
                    </code>{" "}
                    section for fixes to work
                  </li>
                  <li>
                    Removing the snippet will remove all applied SEO fixes
                  </li>
                  <li>
                    Changes may take a few minutes to be visible to search
                    engines
                  </li>
                  <li>
                    You can view the snippet anytime from the project dashboard
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleViewProject}
            >
              <ExternalLink size={16} className="mr-2" />
              View Project Dashboard
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FixSuccessModal;
