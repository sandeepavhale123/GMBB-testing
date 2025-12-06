import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Instagram,
  Twitter,
  Linkedin,
  ImageIcon,
  Youtube,
  MessageSquare,
  Loader2,
  Image,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { PlatformType } from "../../types";
import { useUpcomingPosts } from "../../hooks/useSocialPoster";
import { useProfile } from "@/hooks/useProfile";
import { formatUTCDateInUserTimezone } from "@/utils/dateUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const platformIcons: Record<PlatformType, React.ElementType> = {
  facebook: FaFacebookF,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  linkedin_individual: Linkedin,
  linkedin_organisation: Linkedin,
  threads: MessageSquare,
  pinterest: ImageIcon,
  youtube: Youtube,
};

const platformColors: Record<PlatformType, string> = {
  facebook: "hsl(221, 75%, 55%)",
  instagram: "hsl(330, 75%, 50%)",
  twitter: "hsl(0, 0%, 0%)",
  linkedin: "hsl(201, 100%, 35%)",
  linkedin_individual: "hsl(201, 100%, 35%)",
  linkedin_organisation: "hsl(201, 100%, 35%)",
  threads: "hsl(0, 0%, 0%)",
  pinterest: "hsl(0, 78%, 52%)",
  youtube: "hsl(0, 100%, 50%)",
};

// Color palette for post thumbnails without media
const placeholderColors = [
  "hsl(217, 91%, 60%)",
  "hsl(262, 83%, 58%)",
  "hsl(330, 75%, 50%)",
  "hsl(24, 100%, 50%)",
  "hsl(142, 71%, 45%)",
];

export const UpcomingPostsRedesigned: React.FC = () => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/UpcomingPostsRedesigned",
  ]);
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";
  const { data, isLoading, error } = useUpcomingPosts(5);

  if (isLoading) {
    return (
      <Card className="bg-card h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("upcomingPosts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("upcomingPosts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive text-center py-6">
            {t("error.upcomingPostsFailed")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const upcomingPosts = data?.data || [];

  if (upcomingPosts.length === 0) {
    return (
      <Card className="bg-card h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t("upcomingPosts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-medium">
              {t("empty.noScheduledPosts")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("empty.createFirstPost")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card h-full pb-3">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {t("upcomingPosts")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-[450px] overflow-y-auto">
        {upcomingPosts.map((post, index) => {
          const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
          const placeholderColor =
            placeholderColors[index % placeholderColors.length];

          return (
            <div
              key={post.id}
              className="flex gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              {/* Thumbnail */}
              {hasMedia ? (
                <img
                  src={post.mediaUrls[0]}
                  alt={t("post.previewAlt")}
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: placeholderColor }}
                >
                  <Image className="h-6 w-6 text-white/80" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    {formatUTCDateInUserTimezone(
                      post.scheduledFor,
                      userTimezone
                    )}
                  </p>
                  <div className="flex items-center -space-x-2">
                    {post.platforms.slice(0, 4).map((platform, idx) => {
                      const Icon = platformIcons[platform];
                      const color = platformColors[platform];
                      return (
                        <div
                          key={platform}
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card"
                          style={{ backgroundColor: color, zIndex: 4 - idx }}
                        >
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                      );
                    })}
                    {post.platforms.length > 4 && (
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground"
                        style={{ zIndex: 0 }}
                      >
                        +{post.platforms.length - 4}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium line-clamp-2 mb-2">
                  {post.content}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
