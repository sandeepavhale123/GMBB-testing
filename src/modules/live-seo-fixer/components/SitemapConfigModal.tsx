import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, X } from "lucide-react";
import { projectService } from "@/services/liveSeoFixer/projectService";

interface SitemapConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const SitemapConfigModal: React.FC<SitemapConfigModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const navigate = useNavigate();
  const [sitemaps, setSitemaps] = useState<string[]>([""]);

  const submitMutation = useMutation({
    mutationFn: (sitemapUrls: string[]) =>
      projectService.submitSitemaps(projectId, sitemapUrls),
    onSuccess: (data) => {
      toast.success("Sitemaps submitted successfully");
      navigate(
        `/module/live-seo-fixer/projects/${projectId}/page-selection?auditId=${data.audit_id}`
      );
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit sitemaps");
    },
  });

  const handleAddSitemap = () => {
    if (sitemaps.length < 2) {
      setSitemaps([...sitemaps, ""]);
    }
  };

  const handleRemoveSitemap = (index: number) => {
    setSitemaps(sitemaps.filter((_, i) => i !== index));
  };

  const handleSitemapChange = (index: number, value: string) => {
    const newSitemaps = [...sitemaps];
    newSitemaps[index] = value;
    setSitemaps(newSitemaps);
  };

  const handleSubmit = () => {
    const validSitemaps = sitemaps.filter((s) => s.trim() !== "");
    if (validSitemaps.length === 0) {
      toast.error("Please enter at least one sitemap URL");
      return;
    }

    // Basic URL validation
    const invalidUrls = validSitemaps.filter((url) => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      toast.error("Please enter valid URLs");
      return;
    }

    submitMutation.mutate(validSitemaps);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Sitemap URLs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter up to 2 sitemap URLs to discover pages for auditing.
          </p>

          {sitemaps.map((sitemap, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor={`sitemap-${index}`}>Sitemap URL {index + 1}</Label>
                <Input
                  id={`sitemap-${index}`}
                  value={sitemap}
                  onChange={(e) => handleSitemapChange(index, e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                />
              </div>
              {sitemaps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-8"
                  onClick={() => handleRemoveSitemap(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          {sitemaps.length < 2 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSitemap}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Sitemap
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
