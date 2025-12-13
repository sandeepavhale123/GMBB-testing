import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Smile, X, Loader2, ImagePlus, Wand2, FileText, AlertCircle } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { CharacterCounter, getCharacterLimit, getPlatformLimits } from "./CharacterCounter";
import { MediaItem, ChannelContent, PlatformType } from "../../types";
import { toast } from "sonner";
import { AIDescriptionModal } from "@/components/Posts/AIDescriptionModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { cn } from "@/lib/utils";

interface ComposePostCardProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: string[];
  uploadedMedia: MediaItem[];
  isUploading: boolean;
  deletingMediaId: string | null;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMediaRemove: (index: number) => void;
  onEmojiClick: () => void;
  onLinkClick: () => void;
  // New props for channel-specific content
  channelContents: Record<string, ChannelContent>;
  onChannelContentChange: (platform: string, content: string, useCustom: boolean) => void;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return { Icon: FaFacebookF, color: "hsl(221, 75%, 55%)", name: "Facebook" };
    case "instagram":
      return { Icon: FaInstagram, color: "hsl(330, 75%, 50%)", name: "Instagram" };
    case "twitter":
      return { Icon: FaTwitter, color: "hsl(0, 0%, 0%)", name: "Twitter" };
    case "linkedin":
    case "linkedin_individual":
    case "linkedin_organisation":
      return { Icon: FaLinkedinIn, color: "hsl(201, 100%, 35%)", name: "LinkedIn" };
    case "threads":
      return { Icon: SiThreads, color: "hsl(0, 0%, 0%)", name: "Threads" };
    default:
      return { Icon: FileText, color: "hsl(var(--muted-foreground))", name: platform };
  }
};

// Get unique display platforms (consolidate linkedin variants)
const getDisplayPlatforms = (platforms: string[]): string[] => {
  const uniquePlatforms = new Set<string>();
  platforms.forEach(p => {
    if (p === "linkedin_individual" || p === "linkedin_organisation") {
      uniquePlatforms.add("linkedin");
    } else {
      uniquePlatforms.add(p);
    }
  });
  return Array.from(uniquePlatforms);
};

export const ComposePostCard: React.FC<ComposePostCardProps> = ({
  content,
  onContentChange,
  selectedPlatforms,
  uploadedMedia,
  isUploading,
  deletingMediaId,
  onMediaUpload,
  onMediaRemove,
  onEmojiClick,
  onLinkClick,
  channelContents,
  onChannelContentChange,
  activeTab,
  onActiveTabChange,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-createpost/ComposePostCard",
  ]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const displayPlatforms = useMemo(() => getDisplayPlatforms(selectedPlatforms), [selectedPlatforms]);

  // Get content for current tab
  const getTabContent = (tab: string): string => {
    if (tab === "draft") return content;
    const channelData = channelContents[tab];
    if (!channelData || !channelData.useCustomContent) return content;
    return channelData.content;
  };

  // Check if platform is over limit
  const isPlatformOverLimit = (platform: string): boolean => {
    const platformContent = getTabContent(platform);
    const limit = getCharacterLimit(platform);
    return limit !== Infinity && platformContent.length > limit;
  };

  // Handle content change for draft tab
  const handleDraftContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  // Handle content change for channel tab
  const handleChannelContentChange = (platform: string, value: string) => {
    const channelData = channelContents[platform];
    onChannelContentChange(platform, value, channelData?.useCustomContent ?? false);
  };

  // Toggle custom content for a channel
  const handleToggleCustomContent = (platform: string, checked: boolean) => {
    const channelData = channelContents[platform];
    const currentContent = checked ? content : (channelData?.content || content);
    onChannelContentChange(platform, currentContent, checked);
  };

  // Render textarea with character counter for a specific tab
  const renderTextarea = (tab: string) => {
    const isDraft = tab === "draft";
    const tabContent = getTabContent(tab);
    const channelData = channelContents[tab];
    const useCustom = channelData?.useCustomContent ?? false;
    const limit = isDraft ? undefined : getCharacterLimit(tab);
    const isOverLimit = !isDraft && limit && limit !== Infinity && tabContent.length > limit;

    return (
      <div className="space-y-3">
        {/* Custom content toggle for channel tabs */}
        {!isDraft && (
          <div className="flex items-center gap-2">
            <Checkbox 
              id={`use-custom-${tab}`}
              checked={useCustom}
              onCheckedChange={(checked) => handleToggleCustomContent(tab, checked as boolean)}
            />
            <label 
              htmlFor={`use-custom-${tab}`} 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {t("tabs.customContent")}
            </label>
          </div>
        )}

        <div className="relative">
          <Textarea
            placeholder={t("placeholder")}
            value={tabContent}
            onChange={isDraft 
              ? handleDraftContentChange 
              : (e) => handleChannelContentChange(tab, e.target.value)
            }
            disabled={!isDraft && !useCustom}
            className={cn(
              "min-h-[150px] resize-none pr-12",
              !isDraft && !useCustom && "opacity-60 cursor-not-allowed",
              isOverLimit && "border-destructive focus-visible:ring-destructive"
            )}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => setIsAIModalOpen(true)}
            className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
            title={t("ai_generate")}
            disabled={!isDraft && !useCustom}
          >
            <Wand2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Character warning for channel tabs */}
        {!isDraft && isOverLimit && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">
              {t("tabs.characterWarning", { limit: limit, current: tabContent.length })}
            </span>
          </div>
        )}

        {/* Toolbar row */}
        <div className="flex items-center justify-between pt-2 border-t gap-5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById("media-upload-input")?.click()}
              className="h-8 w-8 p-0"
              disabled={uploadedMedia.length > 0 || isUploading}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEmojiClick}
              className="h-8 w-8 p-0"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <CharacterCounter 
            content={tabContent} 
            platforms={isDraft ? selectedPlatforms : [tab]}
            singlePlatformMode={!isDraft}
          />
        </div>
      </div>
    );
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-lg">{t("title")}</CardTitle>
            <TabsList className="h-auto gap-1 bg-muted/50 p-1">
              {/* Draft tab - always visible */}
              <TabsTrigger 
                value="draft" 
                className="flex items-center gap-1.5 data-[state=active]:bg-background px-2 py-1 text-xs"
              >
                <FileText className="h-3 w-3" />
                <span>{t("tabs.draft")}</span>
              </TabsTrigger>

              {/* Channel tabs */}
              {displayPlatforms.map((platform) => {
                const { Icon, color, name } = getPlatformIcon(platform);
                const isOverLimit = isPlatformOverLimit(platform);
                
                return (
                  <TabsTrigger 
                    key={platform} 
                    value={platform}
                    className={cn(
                      "flex items-center gap-1.5 data-[state=active]:bg-background relative px-2 py-1 text-xs",
                      isOverLimit && "text-destructive"
                    )}
                  >
                    <div 
                      className="flex items-center justify-center w-4 h-4 rounded-full"
                      style={{ backgroundColor: isOverLimit ? "hsl(var(--destructive))" : color }}
                    >
                      <Icon className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="hidden sm:inline">{name}</span>
                    {isOverLimit && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Draft tab content */}
          <TabsContent value="draft" className="mt-0">
            {renderTextarea("draft")}
          </TabsContent>

          {/* Channel tab contents */}
          {displayPlatforms.map((platform) => (
            <TabsContent key={platform} value={platform} className="mt-0">
              {renderTextarea(platform)}
            </TabsContent>
          ))}

          {/* Hidden file input */}
          <Input
            id="media-upload-input"
            type="file"
            accept="image/png, image/jpeg, image/jpg, video/*"
            className="hidden"
            onChange={onMediaUpload}
            disabled={uploadedMedia.length > 0 || isUploading}
          />

          {/* Instagram media warning */}
          {selectedPlatforms.includes("instagram") && uploadedMedia.length === 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
              <div className="text-chart-4 text-sm">
                ⚠️ {t("instagram_warning")}
              </div>
            </div>
          )}

          {/* Uploaded Media Preview */}
          {(uploadedMedia.length > 0 || isUploading) && (
            <div className="space-y-3">
              {uploadedMedia.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedMedia.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.mediaType === "video" ? (
                        <video
                          src={file.preview}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                      ) : (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                      )}
                      {deletingMediaId === file.id ? (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onMediaRemove(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {t("uploading_media")}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Tabs>

      <AIDescriptionModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSelect={(description) => {
          if (activeTab === "draft") {
            onContentChange(description);
          } else {
            handleChannelContentChange(activeTab, description);
            // Also enable custom content when AI generates
            handleToggleCustomContent(activeTab, true);
          }
          setIsAIModalOpen(false);
        }}
      />
    </Card>
  );
};
