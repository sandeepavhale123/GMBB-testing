import React, { useState } from "react";
import { Wand2, Loader2, ZoomIn, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { generateAIImage } from "../../api/mediaApi";
import { useToast } from "../../hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const { t } = useI18nNamespace("Post/aiImageModal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    prompt: "",
    variants: "1",
    style: "",
  });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedImages([]);

    try {
      const response = await generateAIImage({
        prompt: formData.prompt,
        variants: parseInt(formData.variants),
        style: formData.style,
      });

      if (response.code === 200 && response.data.results) {
        const imageUrls = response.data.results.map((result) => result.url);
        setGeneratedImages(imageUrls);

        toast({
          title: t("toast.successTitle"),
          description: t("toast.successDescription", {
            count: imageUrls.length,
          }),
        });
      } else {
        throw new Error(response.message || "Failed to generate images");
      }
    } catch (error) {
      console.error("AI Image generation error:", error);
      toast({
        title: t("toast.failedTitle"),
        description:
          error?.response?.data?.message ||
          error.message ||
          t("toast.failedDescription"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleImageSelection = (image: string) => {
    setSelectedImages((prev) =>
      prev.includes(image)
        ? prev.filter((img) => img !== image)
        : [...prev, image]
    );
  };

  const handleUseSelected = () => {
    if (selectedImages.length > 0) {
      // Use the first selected image URL
      onSelect(selectedImages[0]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Input Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label
                htmlFor="image-prompt"
                className="text-sm font-medium mb-2 block"
              >
                {t("form.prompt")}
              </Label>
              <Textarea
                id="image-prompt"
                value={formData.prompt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
                placeholder={t("form.promptPlaceholder")}
                className="text-sm sm:text-base min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("form.variants")}
                </Label>
                <Select
                  value={formData.variants}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      variants: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Image</SelectItem>
                    <SelectItem value="2">2 Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("form.style")}
                </Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      style: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.stylePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">{t("styles.flat")}</SelectItem>
                    <SelectItem value="illustration">
                      {t("styles.illustration")}
                    </SelectItem>
                    <SelectItem value="realistic">
                      {t("styles.realistic")}
                    </SelectItem>
                    <SelectItem value="modern">{t("styles.modern")}</SelectItem>
                    <SelectItem value="vintage">
                      {t("styles.vintage")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("buttons.generating")}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t("buttons.generate")}
                </>
              )}
            </Button>
          </div>

          {/* Generated Images Grid */}
          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-medium text-sm sm:text-base">
                  {t("labels.generatedImages")}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("buttons.regenerate")}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedImages.includes(image)}
                              onCheckedChange={() =>
                                toggleImageSelection(image)
                              }
                            />
                            <span className="text-sm">
                              {t("labels.select")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed position */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t bg-white">
          <span className="text-sm text-gray-500 text-center sm:text-left">
            {t("labels.selectedCount", { count: selectedImages.length })}
          </span>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              {t("buttons.close")}
            </Button>
            <Button
              disabled={selectedImages.length === 0}
              onClick={handleUseSelected}
              className="w-full sm:w-auto"
            >
              {t("buttons.useSelected")} ({selectedImages.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
