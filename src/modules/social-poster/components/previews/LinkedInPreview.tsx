import React from "react";
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListingContext } from "@/context/ListingContext";
import { MediaItem } from "../../types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface LinkedInPreviewProps {
  content: string;
  media?: MediaItem[];
}

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  content,
  media,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-preview/LinkedInPreview",
  ]);
  const { selectedListing } = useListingContext();

  const businessName =
    selectedListing?.name || t("linkedin.fallbackBusinessName");
  const businessInitials = businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayContent = content || t("linkedin.fallbackContent");
  const truncatedContent =
    displayContent.length > 110
      ? displayContent.slice(0, 110) + "..."
      : displayContent;
  const firstMedia = media?.[0];

  return (
    <div className="max-w-[380px] mx-auto bg-white rounded-lg border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3 flex items-start justify-between">
        <div className="flex items-start gap-2">
          <Avatar className="w-12 h-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[hsl(201,100%,35%)] text-white font-semibold">
              {businessInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm text-foreground hover:underline hover:text-[hsl(201,100%,35%)] cursor-pointer">
              {businessName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {" "}
              {t("linkedin.followers", { count: 1234 })}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {t("linkedin.justNow")} ·{" "}
              <span className="inline-block w-3 h-3">🌐</span>
            </p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
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
              alt={t("linkedin.altmedia")}
              className="w-full max-h-[300px] object-cover"
            />
          )}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center gap-1">
          <div className="flex items-center -space-x-1">
            <div className="w-4 h-4 rounded-full bg-[hsl(201,100%,35%)] flex items-center justify-center border border-white">
              <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[hsl(142,71%,45%)] flex items-center justify-center border border-white">
              <span className="text-[8px] text-white">👏</span>
            </div>
          </div>
          <span className="ml-1">87</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{t("linkedin.commentsCount", { count: 24 })}</span>
          <span>{t("linkedin.repostsCount", { count: 5 })}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-3 py-1 flex items-center justify-around border-t border-border">
        <button className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-muted transition-colors">
          <ThumbsUp className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("linkedin.actions.like")}
          </span>
        </button>
        <button className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-muted transition-colors">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("linkedin.actions.comment")}
          </span>
        </button>
        <button className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-muted transition-colors">
          <Repeat2 className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("linkedin.actions.repost")}
          </span>
        </button>
        <button className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-muted transition-colors">
          <Send className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("linkedin.actions.send")}
          </span>
        </button>
      </div>
    </div>
  );
};
