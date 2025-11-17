import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Copy, RefreshCw, Check } from "lucide-react";
import { generateIssueSuggestion } from "@/services/liveSeoFixer/aiService";
import { useToast } from "@/hooks/use-toast";

interface AIContentModalProps {
  projectName: string;
  pageUrl: string;
  pageType: string;
  targetKeyword: string;
  contentType: "title" | "meta-description" | "alt-tags" | "schema" | "h1";
  currentContent?: string;
  onContentGenerated: (content: string) => void;
  trigger?: React.ReactNode;
  initiallyOpen?: boolean;
  onClose?: () => void;
}

const AIContentModal: React.FC<AIContentModalProps> = ({
  projectName,
  pageUrl,
  pageType,
  targetKeyword,
  contentType,
  currentContent,
  onContentGenerated,
  trigger,
  initiallyOpen = false,
  onClose,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(initiallyOpen);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState("");
  const [customContent, setCustomContent] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // Sync internal open state with initiallyOpen prop
  React.useEffect(() => {
    setOpen(initiallyOpen);
  }, [initiallyOpen]);

  const generateContent = async () => {
    setIsGenerating(true);

    try {
      const response = await generateIssueSuggestion({
        project_name: projectName,
        page_type: pageType,
        target_keyword: targetKeyword,
        page_url: pageUrl,
        issue_type: contentType,
        current_value: currentContent,
      });

      setGeneratedContent(response.data.suggestion);
      setCustomContent(response.data.suggestion);
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    onContentGenerated(customContent);
    setOpen(false);
    onClose?.();
  };

  const handleCancel = () => {
    setOpen(false);
    setGeneratedContent("");
    setCustomContent("");
    onClose?.();
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(customContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case "title":
        return "Page Title";
      case "meta-description":
        return "Meta Description";
      case "alt-tags":
        return "Alt Text";
      case "schema":
        return "Schema Markup";
      default:
        return "Content";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Wand2 size={16} className="mr-2" />
            AI Help
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 size={20} />
            AI Content Generator
          </DialogTitle>
          <DialogDescription>
            Generate optimized {getContentTypeLabel().toLowerCase()} using AI
            for better SEO performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Context Info */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Page: {pageType}</Badge>
            <Badge variant="outline">Keyword: {targetKeyword}</Badge>
            <Badge variant="outline">Type: {getContentTypeLabel()}</Badge>
          </div>

          {/* Current Content */}
          {currentContent && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Content:</label>
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                {currentContent}
              </div>
            </div>
          )}

          {/* Generate Button */}
          {!generatedContent && (
            <Button
              onClick={generateContent}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Wand2 size={16} className="mr-2" />
                  Generate Optimized {getContentTypeLabel()}
                </>
              )}
            </Button>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    AI Generated Content:
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateContent}
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyContent}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className={`min-h-[100px] ${
                    contentType === "schema" ? "font-mono text-xs" : ""
                  }`}
                  placeholder="AI generated content will appear here..."
                />
              </div>

              {/* Character/Length Info */}
              <div className="text-xs text-muted-foreground">
                {contentType === "title" &&
                  `Length: ${customContent.length}/60 characters`}
                {contentType === "meta-description" &&
                  `Length: ${customContent.length}/160 characters`}
                {contentType === "alt-tags" &&
                  `Length: ${customContent.length} characters`}
                {contentType === "schema" && `JSON-LD schema markup`}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUseContent} className="flex-1">
                  <Check size={16} className="mr-2" />
                  Use This Content
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">
              SEO Tips for {getContentTypeLabel()}:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {contentType === "title" && (
                <>
                  <li>• Include target keyword at the beginning</li>
                  <li>• Keep under 60 characters for full display</li>
                  <li>• Make it compelling and click-worthy</li>
                  <li>• Include brand name when appropriate</li>
                </>
              )}
              {contentType === "meta-description" && (
                <>
                  <li>• Include target keyword naturally</li>
                  <li>• Keep between 150-160 characters</li>
                  <li>• Include a clear call-to-action</li>
                  <li>• Highlight unique value proposition</li>
                </>
              )}
              {contentType === "alt-tags" && (
                <>
                  <li>• Be descriptive and specific</li>
                  <li>• Include keywords when relevant</li>
                  <li>• Keep it concise but informative</li>
                  <li>• Focus on image content and context</li>
                </>
              )}
              {contentType === "h1" && (
                <>
                  <li>• Include primary target keyword</li>
                  <li>• Only one H1 tag per page</li>
                  <li>• Make it clear and descriptive</li>
                  <li>• Align with page title and content</li>
                </>
              )}
              {contentType === "schema" && (
                <>
                  <li>• Use appropriate schema types</li>
                  <li>• Include all relevant properties</li>
                  <li>• Validate with Google's tool</li>
                  <li>• Keep data accurate and up-to-date</li>
                </>
              )}
              {![
                "title",
                "meta-description",
                "alt-tags",
                "h1",
                "schema",
              ].includes(contentType) && (
                <>
                  <li>• Include relevant keywords naturally</li>
                  <li>• Keep content clear and descriptive</li>
                  <li>• Align with user search intent</li>
                  <li>• Follow SEO best practices for your content type</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIContentModal;
