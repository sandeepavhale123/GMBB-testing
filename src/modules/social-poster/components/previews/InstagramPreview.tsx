import React from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListingContext } from "@/context/ListingContext";
import { MediaItem } from "../../types";

interface InstagramPreviewProps {
  content: string;
  media?: MediaItem[];
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({ content, media }) => {
  const { selectedListing } = useListingContext();

  const businessName = selectedListing?.name || "Your Business";
  const businessHandle = businessName.toLowerCase().replace(/\s+/g, "");
  const businessInitials = businessName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayContent = content || "Your post content will appear here...";
  const truncatedContent = displayContent.length > 110 ? displayContent.slice(0, 110) + "..." : displayContent;
  const firstMedia = media?.[0];

  return (
    <div className="max-w-[360px] mx-auto bg-white rounded-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 ring-2 ring-[hsl(340,75%,55%)] ring-offset-2">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-[hsl(340,75%,55%)] to-[hsl(45,100%,50%)] text-white font-semibold text-xs">
              {businessInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm text-foreground">{businessHandle}</h3>
          </div>
        </div>
        <MoreHorizontal className="w-6 h-6 text-foreground" />
      </div>

      {/* Media */}
      <div className="relative w-full aspect-square bg-muted">
        {firstMedia?.preview ? (
          firstMedia.mediaType === "video" ? (
            <video src={firstMedia.preview} className="w-full h-full object-cover" controls />
          ) : (
            <img src={firstMedia.preview} alt="Post media" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent">
            <span className="text-muted-foreground text-sm">Add an image</span>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-foreground hover:text-muted-foreground cursor-pointer transition-colors" />
            <MessageCircle className="w-6 h-6 text-foreground hover:text-muted-foreground cursor-pointer transition-colors" />
            <Send className="w-6 h-6 text-foreground hover:text-muted-foreground cursor-pointer transition-colors" />
          </div>
          <Bookmark className="w-6 h-6 text-foreground hover:text-muted-foreground cursor-pointer transition-colors" />
        </div>

        {/* Likes */}
        <div className="mb-2">
          <p className="text-sm font-semibold text-foreground">324 likes</p>
        </div>

        {/* Caption */}
        <div className="text-sm text-foreground">
          <span className="font-semibold mr-2">{businessHandle}</span>
          <span className="whitespace-pre-wrap break-words">{truncatedContent}</span>
        </div>

        {/* Comments Preview */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">View all 18 comments</p>
        </div>

        {/* Timestamp */}
        <div className="mt-1">
          <p className="text-xs text-muted-foreground uppercase">Just now</p>
        </div>
      </div>
    </div>
  );
};
