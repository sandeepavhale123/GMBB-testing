import React from "react";
import { Image, Play, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import type { BulkMediaOverviewItem } from "@/api/mediaApi";
import { formatPublishDate } from "../utils";

interface BulkMediaCardProps {
  media: BulkMediaOverviewItem;
  deletingId: string | null;
  onDeleteClick: (item: { id: string; category: string }) => void;
}

export const BulkMediaCard: React.FC<BulkMediaCardProps> = React.memo(
  ({ media, deletingId, onDeleteClick }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkMedia");
    const navigate = useNavigate();

    return (
      <div className="gap-6 pb-5 mb-6 border-b border-gray-200">
        <div className="flex flex-col-reverse md:flex-row md:items-start gap-4 md:gap-6">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Status Information */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {media.livePosts > 0 && (
                <span className="text-sm font-medium text-slate-500">
                  {t("messages.postedOn", { count: media.livePosts })}
                </span>
              )}
              {media.failedPosts > 0 && (
                <span className="text-sm font-medium text-slate-500">
                  {t("messages.failedOn", { count: media.failedPosts })}
                </span>
              )}
              {media.schedulePosts > 0 && (
                <span className="text-sm font-medium text-slate-500">
                  {t("messages.scheduledOn", { count: media.schedulePosts })}
                </span>
              )}
              {media.livePosts === 0 &&
                media.failedPosts === 0 &&
                media.schedulePosts === 0 && (
                  <span className="text-sm text-muted-foreground">
                    {t("messages.noActivePosts")}
                  </span>
                )}
            </div>

            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="font-semibold text-foreground mb-1 line-clamp-2 text-xl">
                {media.category}
              </div>
              <Badge variant="outline" className="flex gap-2">
                {media.mediaType === "video" ? (
                  <>
                    <Play className="w-3 h-3" /> {t("mediaTypes.video")}
                  </>
                ) : (
                  <>
                    <Image className="w-3 h-3" /> {t("mediaTypes.photo")}
                  </>
                )}
              </Badge>
            </div>

            {/* Meta Information */}
            <div className="text-sm text-muted-foreground mb-4">
              {media.location_count} {t("location")} •{" "}
              {formatPublishDate(media.publishDate)}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() =>
                  navigate(`/main-dashboard/bulk-media-details/${media.id}`)
                }
              >
                {t("buttons.viewDetails")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={() =>
                  onDeleteClick({ id: media.id, category: media.category })
                }
                disabled={deletingId === media.id}
              >
                <Trash2 className="h-4 w-4" />
                {deletingId === media.id
                  ? t("buttons.deleting")
                  : t("buttons.delete")}
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0">
            <div
              className="bg-muted rounded-lg overflow-hidden relative group"
              style={{ height: "190px", width: "337px" }}
            >
              {media.url ? (
                <>
                  <img
                    src={media.url}
                    alt={`${media.category} media`}
                    className="w-full h-[190px] object-cover transition-all duration-300"
                    style={{ aspectRatio: "16/9" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-muted rounded-lg flex items-center justify-center"><span class="text-xs text-muted-foreground text-center px-2">${t(
                          "messages.noImage"
                        )}</span></div>`;
                      }
                    }}
                  />
                  {media.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-2">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center px-2">
                    {t("messages.noImage")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BulkMediaCard.displayName = "BulkMediaCard";
