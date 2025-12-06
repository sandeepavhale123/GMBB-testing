import React from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListingContext } from "@/context/ListingContext";
import { MediaItem } from "../../types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ThreadsPreviewProps {
  content: string;
  media?: MediaItem[];
}

export const ThreadsPreview: React.FC<ThreadsPreviewProps> = ({
  content,
  media,
}) => {
  const { selectedListing } = useListingContext();
  const { t } = useI18nNamespace([
    "social-poster-components-preview/ThreadsPreview",
  ]);
  const businessName =
    selectedListing?.name || t("threads.fallbackBusinessName");
  const businessHandle = businessName.toLowerCase().replace(/\s+/g, "");
  const businessInitials = businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayContent = content || t("threads.fallbackContent");
  const truncatedContent =
    displayContent.length > 110
      ? displayContent.slice(0, 110) + "..."
      : displayContent;
  const firstMedia = media?.[0];

  return (
    <div className="max-w-[380px] mx-auto bg-white">
      <div className="px-3 py-3">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-foreground text-background font-semibold text-xs">
              {businessInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[15px] text-foreground">
                {businessHandle}
              </span>
              <span className="text-muted-foreground text-xs">
                · {t("threads.timestampNow")}
              </span>
            </div>
          </div>

          <button className="p-1 hover:bg-muted rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="pl-12">
          <p className="text-[15px] text-foreground leading-normal whitespace-pre-wrap break-words mb-3">
            {truncatedContent}
          </p>

          {/* Media */}
          {firstMedia?.preview && (
            <div className="relative w-full rounded-xl overflow-hidden mb-3">
              {firstMedia.mediaType === "video" ? (
                <video
                  src={firstMedia.preview}
                  className="w-full max-h-[280px] object-cover"
                  controls
                />
              ) : (
                <img
                  src={firstMedia.preview}
                  alt={t("threads.altmedia")}
                  className="w-full max-h-[280px] object-cover"
                />
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center gap-3 pt-2">
            <button className="group flex items-center hover:opacity-60 transition-opacity">
              <Heart className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            </button>

            <button className="group flex items-center hover:opacity-60 transition-opacity">
              <MessageCircle
                className="w-6 h-6 text-foreground"
                strokeWidth={1.5}
              />
            </button>

            <button className="group flex items-center hover:opacity-60 transition-opacity">
              <Repeat2 className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            </button>

            <button className="group flex items-center hover:opacity-60 transition-opacity">
              <Share className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
            <span>{t("threads.stats.replies", { count: 42 })}</span>
            <span>·</span>
            <span>{t("threads.stats.likes", { count: 128 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
