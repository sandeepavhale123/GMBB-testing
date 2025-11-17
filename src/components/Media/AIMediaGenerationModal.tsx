import React, { Suspense, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X, Sparkles } from "lucide-react";
import { generateAIImage } from "../../api/mediaApi";
import { useToast } from "../../hooks/use-toast";
// import { AIPromptInput } from "./AIGeneration/AIPromptInput";
// import { AIParameters } from "./AIGeneration/AIParameters";
// import { AIImagePreview } from "./AIGeneration/AIImagePreview";
// import { AIActionButtons } from "./AIGeneration/AIActionButtons";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { lazyImport } from "@/routes/lazyImport";

// Lazy-loaded components
const AIPromptInput = lazyImport(() =>
  import("./AIGeneration/AIPromptInput").then((m) => ({
    default: m.AIPromptInput,
  }))
);

const AIParameters = lazyImport(() =>
  import("./AIGeneration/AIParameters").then((m) => ({
    default: m.AIParameters,
  }))
);

const AIImagePreview = lazyImport(() =>
  import("./AIGeneration/AIImagePreview").then((m) => ({
    default: m.AIImagePreview,
  }))
);

const AIActionButtons = lazyImport(() =>
  import("./AIGeneration/AIActionButtons").then((m) => ({
    default: m.AIActionButtons,
  }))
);

interface AIMediaGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (media: {
    imageUrl: string;
    prompt: string;
    variants: number;
    style: string;
  }) => void;
}

export const AIMediaGenerationModal: React.FC<AIMediaGenerationModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const { t } = useI18nNamespace("Media/aiMediaGeneration");
  const [prompt, setPrompt] = useState("");
  const [variants, setVariants] = useState(1);
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: t("aiMediaGeneration.missingPromptTitle"),
        description: t("aiMediaGeneration.missingPromptDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await generateAIImage({
        prompt: prompt.trim(),
        variants,
        style,
      });

      if (response.code === 200 && response.data.results.length > 0) {
        const imageUrls = response.data.results.map((result) => result.url);
        setGeneratedImages(imageUrls);
        setSelectedImageIndex(0);

        toast({
          title: t("aiMediaGeneration.generationSuccessTitle"),
          description: t("aiMediaGeneration.generationSuccessDescription", {
            count: imageUrls.length,
            plural: imageUrls.length > 1 ? "s" : "",
          }),
          // `Successfully generated ${imageUrls.length} image${
          //   imageUrls.length > 1 ? "s" : ""
          // }.`,
        });
      } else {
        throw new Error(response.message || "Failed to generate images");
      }
    } catch (error) {
      // console.error("AI image generation error:", error);
      toast({
        title: t("aiMediaGeneration.generationFailedTitle"),
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("aiMediaGeneration.generationFailedDescription"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseMedia = () => {
    if (generatedImages.length > 0 && generatedImages[selectedImageIndex]) {
      const imageUrl = generatedImages[selectedImageIndex];

      onGenerated({
        imageUrl: imageUrl,
        prompt: prompt,
        variants: variants,
        style: style,
      });

      toast({
        title: t("aiMediaGeneration.imageReadyTitle"),
        description: t("aiMediaGeneration.imageReadyDescription"),
      });
    }
  };

  const handleRegenerate = () => {
    setGeneratedImages([]);
    setSelectedImageIndex(0);
    handleGenerate();
  };

  const handleClose = () => {
    // Clear all AI generation state
    setPrompt("");
    setVariants(1);
    setStyle("realistic");
    setGeneratedImages([]);
    setSelectedImageIndex(0);
    setIsGenerating(false);
    onClose();
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : generatedImages.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < generatedImages.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                {t("aiMediaGeneration.title")}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <Suspense fallback={<div>Loading...</div>}>
            {generatedImages.length === 0 ? (
              <>
                <AIPromptInput prompt={prompt} onPromptChange={setPrompt} />

                <AIParameters
                  variants={variants}
                  style={style}
                  onVariantsChange={setVariants}
                  onStyleChange={setStyle}
                />

                <AIActionButtons
                  isGenerating={isGenerating}
                  hasGenerated={false}
                  prompt={prompt}
                  onGenerate={handleGenerate}
                  isDownloading={false}
                  onRegenerate={handleRegenerate}
                  onUseMedia={handleUseMedia}
                />
              </>
            ) : (
              <>
                <AIImagePreview
                  images={generatedImages}
                  selectedIndex={selectedImageIndex}
                  prompt={prompt}
                  style={style}
                  onPreviousImage={handlePreviousImage}
                  onNextImage={handleNextImage}
                  onSelectImage={setSelectedImageIndex}
                  onCloseModal={handleClose}
                />

                <AIActionButtons
                  isGenerating={isGenerating}
                  hasGenerated={true}
                  prompt={prompt}
                  onGenerate={handleGenerate}
                  isDownloading={false}
                  onRegenerate={handleRegenerate}
                  onUseMedia={handleUseMedia}
                />
              </>
            )}
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
};
