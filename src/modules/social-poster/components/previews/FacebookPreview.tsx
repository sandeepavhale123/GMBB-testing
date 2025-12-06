import React from "react";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListingContext } from "@/context/ListingContext";
import { MediaItem } from "../../types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface FacebookPreviewProps {
  content: string;
  media?: MediaItem[];
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({
  content,
  media,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-preview/FacebookPreview",
  ]);
  const { selectedListing } = useListingContext();

  const businessName =
    selectedListing?.name || t("facebook.fallbackBusinessName");
  const businessInitials = businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayContent = content || t("facebook.fallbackContent");
  const truncatedContent =
    displayContent.length > 110
      ? displayContent.slice(0, 110) + "..."
      : displayContent;
  const firstMedia = media?.[0];

  return (
    <div className="max-w-[380px] mx-auto bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[hsl(221,50%,50%)] text-white font-semibold text-sm">
              {businessInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-[15px] text-foreground">
              {businessName}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {t("facebook.justNow")} ·{" "}
              <span className="inline-block w-3 h-3">🌐</span>
            </p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {truncatedContent}
        </p>
      </div>

      {/* Media */}
      {firstMedia?.preview && (
        <div className="relative w-full bg-muted">
          {firstMedia.mediaType === "video" ? (
            <video
              src={firstMedia.preview}
              className="w-full max-h-[300px] object-cover"
              controls
            />
          ) : (
            <img
              src={firstMedia.preview}
              alt={t("facebook.altmedia")}
              className="w-full max-h-[300px] object-cover"
            />
          )}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-[18px] h-[18px] rounded-full bg-[hsl(221,50%,50%)] flex items-center justify-center">
            <ThumbsUp className="w-3 h-3 text-white fill-white" />
          </div>
          <span>42</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{t("facebook.comments", { count: 12 })}</span>
          <span>{t("facebook.shares", { count: 3 })}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-3 py-2 flex items-center justify-around border-t border-border">
        <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors">
          <ThumbsUp className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("facebook.like")}
          </span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors">
          <MessageCircle className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("facebook.comment")}
          </span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors">
          <Share2 className="w-[18px] h-[18px] text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("facebook.share")}
          </span>
        </button>
      </div>
    </div>
  );
};
