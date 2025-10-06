import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { PostPreview } from "./PostPreview";
import PostPreviewErrorBoundary from "./PostPreviewErrorBoundary";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    ctaButton: string;
    ctaUrl: string;
    image: File | string | null;
    platforms: string[];
  };
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { t } = useI18nNamespace("Post/postPreviewModal");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <PostPreviewErrorBoundary>
            <PostPreview data={data} />
          </PostPreviewErrorBoundary>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
