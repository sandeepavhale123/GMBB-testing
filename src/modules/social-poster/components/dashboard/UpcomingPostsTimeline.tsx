import React from "react";
import {
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ImageIcon,
  Youtube,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { PlatformType } from "../../types";
import { format } from "date-fns";
import { useUpcomingPosts } from "../../hooks/useSocialPoster";
import { useProfile } from "@/hooks/useProfile";
import { formatUTCDateInUserTimezone } from "@/utils/dateUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const platformIcons: Record<PlatformType, React.ElementType> = {
  facebook: Facebook,
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

export const UpcomingPostsTimeline: React.FC = () => {
  const { t } = useI18nNamespace([
    "social-poster-components-dashboard/UpcomingPostsTimeline",
  ]);
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";
  console.log("user profile", profileData);
  const { data, isLoading, error } = useUpcomingPosts(10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-destructive">{t("error")}</p>
      </div>
    );
  }

  const upcomingPosts = data?.data || [];

  if (upcomingPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{t("empty.noScheduled")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("empty.createFirst")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingPosts.map((post) => (
        <div
          key={post.id}
          className="flex gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
        >
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <img
              src={post.mediaUrls[0]}
              alt={t("post.previewAlt")}
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 space-y-2">
            <p className="text-sm line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatUTCDateInUserTimezone(post.scheduledFor, userTimezone)} (
                {userTimezone})
              </div>
              <div className="flex items-center gap-1">
                {post.platforms.map((platform) => {
                  const Icon = platformIcons[platform];
                  const color = platformColors[platform];
                  return (
                    <Icon
                      key={platform}
                      className="h-4 w-4"
                      style={{ color }}
                    />
                  );
                })}
                <span>
                  {t("post.accounts", { count: post.targetCount })}
                  {/* ({post.targetCount} accounts) */}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
