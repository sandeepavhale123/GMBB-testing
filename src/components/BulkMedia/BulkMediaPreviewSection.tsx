import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { format } from "date-fns";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BulkMedia {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaType: string;
  publishDate: string;
  tags: string[];
  status: string;
  media: {
    image: string;
    video: string;
  };
}

interface BulkMediaPreviewSectionProps {
  bulkMedia: BulkMedia | null;
}

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy • hh:mm a");
  } catch (error) {
    return dateString;
  }
};

export const BulkMediaPreviewSection = memo<BulkMediaPreviewSectionProps>(
  ({ bulkMedia }) => {
    const { t } = useI18nNamespace("BulkMedia/bulkMediaPreview");
    return (
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Media Image/Video */}
            {bulkMedia?.media && (
              <div className="w-full relative">
                {bulkMedia.media.video ? (
                  <div className="relative">
                    <video
                      src={bulkMedia.media.video}
                      className="w-full h-48 object-cover rounded-lg border border-border"
                      controls
                      poster={bulkMedia.media.image}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Play className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                ) : bulkMedia.media.image ? (
                  <img
                    src={bulkMedia.media.image}
                    alt={t("altText")}
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                ) : null}
              </div>
            )}

            {/* Category and Media Type */}
            <div className="flex gap-2">
              {bulkMedia?.category && (
                <Badge variant="secondary">{bulkMedia.category}</Badge>
              )}
              {bulkMedia?.mediaType && (
                <Badge variant="outline">{bulkMedia.mediaType}</Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground">
              {bulkMedia?.category || t("untitled")}
            </h3>

            {/* Tags */}
            {bulkMedia?.tags && bulkMedia.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bulkMedia.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Date */}
            {bulkMedia?.publishDate && (
              <div className="text-sm text-muted-foreground">
                {t("publishedOn", {
                  date: formatDateTime(bulkMedia.publishDate),
                })}
                {/* Published on: {formatDateTime(bulkMedia.publishDate)} */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

BulkMediaPreviewSection.displayName = "BulkMediaPreviewSection";
