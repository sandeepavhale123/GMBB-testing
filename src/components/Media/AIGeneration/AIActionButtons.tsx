import React from "react";
import { Button } from "../../ui/button";
import { RefreshCw, Check, Sparkles, Wand2 } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AIActionButtonsProps {
  // Generation state
  isGenerating: boolean;
  hasGenerated: boolean;
  prompt: string;
  onGenerate: () => void;

  // Preview state
  isDownloading: boolean;
  onRegenerate: () => void;
  onUseMedia: () => void;
}

export const AIActionButtons: React.FC<AIActionButtonsProps> = ({
  isGenerating,
  hasGenerated,
  prompt,
  onGenerate,
  isDownloading,
  onRegenerate,
  onUseMedia,
}) => {
  const { t } = useI18nNamespace("Media/aiActionButtons");
  if (!hasGenerated) {
    return (
      <Button
        onClick={onGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isGenerating ? (
          <>
            <Wand2 className="w-5 h-5 mr-2 animate-spin" />
            {t("aiActionButtons.generating")}
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            {t("aiActionButtons.generateImage")}
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={onRegenerate}
        variant="outline"
        className="flex-1 h-12"
        disabled={isGenerating || isDownloading}
      >
        <RefreshCw className="w-4 h-4 mr-1" />
        {t("aiActionButtons.regenerate")}
      </Button>
      <Button
        onClick={onUseMedia}
        className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            {t("aiActionButtons.processing")}
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-1" />
            {t("aiActionButtons.useThis")}
          </>
        )}
      </Button>
    </div>
  );
};
