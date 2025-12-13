import React, { useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Instagram, Twitter, MessageSquare } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FacebookPreview } from "../previews/FacebookPreview";
import { InstagramPreview } from "../previews/InstagramPreview";
import { LinkedInPreview } from "../previews/LinkedInPreview";
import { TwitterPreview } from "../previews/TwitterPreview";
import { ThreadsPreview } from "../previews/ThreadsPreview";
import { MediaItem, ChannelContent } from "../../types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface LivePreviewPanelProps {
  content: string;
  media?: MediaItem[];
  selectedPlatforms: string[];
  // New props for channel-specific content sync
  channelContents?: Record<string, ChannelContent>;
  activeTab?: string;
  onPlatformChange?: (platform: string) => void;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return { Icon: FaFacebookF, color: "hsl(221, 75%, 55%)" };
    case "instagram":
      return { Icon: Instagram, color: "hsl(330, 75%, 50%)" };
    case "twitter":
      return { Icon: Twitter, color: "hsl(0, 0%, 0%)" };
    case "linkedin":
      return { Icon: FaLinkedinIn, color: "hsl(201, 100%, 35%)" };
    case "threads":
      return { Icon: MessageSquare, color: "hsl(0, 0%, 0%)" };
    default:
      return null;
  }
};

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  content,
  media,
  selectedPlatforms,
  channelContents,
  activeTab,
  onPlatformChange,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-createpost/LivePreviewPanel",
  ]);

  const getPlatformDisplayName = (platform: string, t: any): string => {
    return t(`platforms.${platform}`);
  };

  // Consolidate LinkedIn platforms for display
  const displayPlatforms = useMemo(() => {
    const platforms = [...selectedPlatforms];
    const hasLinkedInIndividual = platforms.includes("linkedin_individual");
    const hasLinkedInOrg = platforms.includes("linkedin_organisation");

    if (hasLinkedInIndividual || hasLinkedInOrg) {
      return platforms
        .filter(
          (p) => p !== "linkedin_individual" && p !== "linkedin_organisation"
        )
        .concat("linkedin");
    }

    return platforms;
  }, [selectedPlatforms]);

  const [selectedPlatform, setSelectedPlatform] = React.useState<string>(
    displayPlatforms[0] || ""
  );

  // Sync with active tab from ComposePostCard
  useEffect(() => {
    if (activeTab && activeTab !== "draft" && displayPlatforms.includes(activeTab)) {
      setSelectedPlatform(activeTab);
    }
  }, [activeTab, displayPlatforms]);

  // Update selected platform when platforms change
  useEffect(() => {
    if (!displayPlatforms.includes(selectedPlatform)) {
      setSelectedPlatform(displayPlatforms[0] || "");
    }
  }, [displayPlatforms, selectedPlatform]);

  // Handle platform selection change
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    onPlatformChange?.(platform);
  };

  // Get content for the selected platform (respecting channel-specific content)
  const getPreviewContent = (): string => {
    if (!channelContents || !selectedPlatform) return content;
    
    const channelData = channelContents[selectedPlatform];
    if (channelData?.useCustomContent) {
      return channelData.content;
    }
    return content;
  };

  const renderPreview = () => {
    if (!selectedPlatform) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {t("noPlatformSelected")}
        </div>
      );
    }

    const previewContent = getPreviewContent();
    const previewProps = { content: previewContent, media };

    switch (selectedPlatform) {
      case "facebook":
        return <FacebookPreview {...previewProps} />;
      case "instagram":
        return <InstagramPreview {...previewProps} />;
      case "linkedin":
        return <LinkedInPreview {...previewProps} />;
      case "twitter":
        return <TwitterPreview {...previewProps} />;
      case "threads":
        return <ThreadsPreview {...previewProps} />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            {t("previewNotAvailable")}
          </div>
        );
    }
  };

  return (
    <Card className="sticky top-[100px]">
      <CardHeader>
        <div className="flex justify-between items-center gap-4">
          <CardTitle className="text-lg">{t("title")}</CardTitle>
          {displayPlatforms.length > 0 && (
            <Select
              value={selectedPlatform}
              onValueChange={handlePlatformChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("selectPlatform")} />
              </SelectTrigger>
              <SelectContent>
                {displayPlatforms.map((platform) => {
                  const iconData = getPlatformIcon(platform);
                  if (!iconData) return null;
                  const { Icon, color } = iconData;
                  return (
                    <SelectItem key={platform} value={platform}>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        >
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <span>{getPlatformDisplayName(platform, t)}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">{renderPreview()}</ScrollArea>
      </CardContent>
    </Card>
  );
};
