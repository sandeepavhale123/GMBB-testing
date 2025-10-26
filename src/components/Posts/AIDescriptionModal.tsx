import React, { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
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
import {
  generatePostDescription,
  GeneratedContent,
} from "../../api/aiContentApi";
import { useToast } from "../../hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AIDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (description: string) => void;
}

export const AIDescriptionModal: React.FC<AIDescriptionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const { t } = useI18nNamespace("Post/aiDescriptionModal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    variants: "3",
    tone: "professional",
  });
  const [generatedVariants, setGeneratedVariants] = useState<
    GeneratedContent[]
  >([]);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.description.trim()) {
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await generatePostDescription({
        description: formData.description,
        tone: formData.tone,
        variants: parseInt(formData.variants),
      });

      if (response.code === 200 && response.data) {
        setGeneratedVariants(response.data);
        if (response.data.length > 0) {
          // Combine title and content for display
          const firstVariantText = response.data[0].title
            ? `${response.data[0].title}\n\n${response.data[0].content}`
            : response.data[0].content;
          setSelectedVariant(firstVariantText);
        }
        toast({
          title: t("toast.successTitle"),
          description: response.message || t("toast.successDescription"),
        });
      } else {
        throw new Error(response.message || "Failed to generate content");
      }
    } catch (error: any) {
      // console.error("Error generating content:", error);
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

  const handleVariantSelect = (variant: GeneratedContent) => {
    const variantText = variant.title
      ? `${variant.title}\n\n${variant.content}`
      : variant.content;
    setSelectedVariant(variantText);
  };

  const handleReset = () => {
    setFormData({
      description: "",
      variants: "3",
      tone: "professional",
    });
    setGeneratedVariants([]);
    setSelectedVariant("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-0">
            {/* Left Side - Input Form and Generated Variants */}
            <div className="flex flex-col space-y-4 min-h-0">
              {/* Input Form - Always visible */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg flex-shrink-0">
                <div>
                  <Label
                    htmlFor="ai-description"
                    className="text-sm font-medium mb-2 block"
                  >
                    {t("shortDescription")}
                  </Label>
                  <Textarea
                    id="ai-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t("shortDescriptionPlaceholder")}
                    rows={3}
                    className="text-sm sm:text-base w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {t("variants")}
                    </Label>
                    <Select
                      value={formData.variants}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, variants: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{t("variant1")}</SelectItem>
                        <SelectItem value="2">{t("variant2")}</SelectItem>
                        <SelectItem value="3">{t("variant3")}</SelectItem>
                        <SelectItem value="4">{t("variant4")}</SelectItem>
                        <SelectItem value="5">{t("variant5")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {t("tone")}
                    </Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, tone: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          {t("tones.professional")}
                        </SelectItem>
                        <SelectItem value="friendly">
                          {t("tones.friendly")}
                        </SelectItem>
                        <SelectItem value="casual">
                          {t("tones.casual")}
                        </SelectItem>
                        <SelectItem value="formal">
                          {t("tones.formal")}
                        </SelectItem>
                        <SelectItem value="enthusiastic">
                          {t("tones.enthusiastic")}
                        </SelectItem>
                        <SelectItem value="persuasive">
                          {t("tones.persuasive")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.description.trim()}
                    className="flex-1 min-h-[44px]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        {t("buttons.generating")}
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-1" />
                        {t("buttons.generate")}
                      </>
                    )}
                  </Button>

                  {generatedVariants.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="min-h-[44px]"
                    >
                      {t("buttons.reset")}
                    </Button>
                  )}
                </div>
              </div>

              {/* Generated Variants - Scrollable */}
              {generatedVariants.length > 0 && (
                <div className="flex-1 min-h-0">
                  <h3 className="font-medium mb-3 text-sm sm:text-base flex-shrink-0">
                    {t("generatedVariants")}
                  </h3>
                  <div className="max-h-[40vh] lg:max-h-[50vh] overflow-y-auto">
                    <div className="space-y-3">
                      {generatedVariants.map((variant, index) => {
                        const variantText = variant.title
                          ? `${variant.title}\n\n${variant.content}`
                          : variant.content;
                        const isSelected = selectedVariant === variantText;

                        return (
                          <div
                            key={index}
                            className={`border rounded-lg p-3 sm:p-4 space-y-3 cursor-pointer transition-colors ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleVariantSelect(variant)}
                          >
                            {variant.title && (
                              <div className="font-medium text-sm text-gray-900">
                                {variant.title}
                              </div>
                            )}
                            <div className="text-sm text-gray-700 leading-relaxed">
                              {variant.content}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVariantSelect(variant);
                                }}
                                className="text-xs"
                                variant={isSelected ? "default" : "outline"}
                              >
                                {isSelected
                                  ? t("buttons.selected")
                                  : t("buttons.select")}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Selected Variant Editor */}
            <div className="flex flex-col space-y-4 min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                <Label className="text-sm font-medium mb-2 block flex-shrink-0">
                  {t("editSelected")}
                </Label>
                <Textarea
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  placeholder={t("editPlaceholder")}
                  className="flex-1 min-h-[200px] lg:min-h-[300px] resize-none text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t flex-shrink-0 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="hidden sm:block min-h-[44px]"
          >
            {t("buttons.close")}
          </Button>
          <Button
            onClick={() => selectedVariant && onSelect(selectedVariant)}
            disabled={!selectedVariant}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {t("buttons.useSelected")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
