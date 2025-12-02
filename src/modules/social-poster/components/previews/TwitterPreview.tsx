import React from "react";
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListingContext } from "@/context/ListingContext";
import { MediaItem } from "../../types";

interface TwitterPreviewProps {
  content: string;
  media?: MediaItem[];
}

export const TwitterPreview: React.FC<TwitterPreviewProps> = ({ content, media }) => {
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
  const truncatedContent = displayContent.length > 110  
    ? displayContent.slice(0, 110 ) + "..." 
    : displayContent;
  const firstMedia = media?.[0];

  return (
    <div className="max-w-[380px] mx-auto bg-white border-b border-border">
      <div className="p-3 hover:bg-muted/30 transition-colors cursor-pointer">
        {/* Header */}
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-foreground text-background font-semibold text-sm">
              {businessInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-1 mb-1">
              <span className="font-bold text-[15px] text-foreground hover:underline truncate">
                {businessName}
              </span>
              <span className="text-muted-foreground text-[15px] truncate">
                @{businessHandle}
              </span>
              <span className="text-muted-foreground text-[15px]">·</span>
              <span className="text-muted-foreground text-[15px]">now</span>
              <div className="ml-auto">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {truncatedContent}
              </p>
            </div>

            {/* Media */}
            {firstMedia?.preview && (
              <div className="relative w-full rounded-2xl overflow-hidden border border-border mb-3">
                {firstMedia.mediaType === 'video' ? (
                  <video
                    src={firstMedia.preview}
                    className="w-full max-h-[300px] object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={firstMedia.preview}
                    alt="Post media"
                    className="w-full max-h-[300px] object-cover"
                  />
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between max-w-[425px]">
              <button className="group flex items-center gap-1 hover:text-[hsl(201,100%,50%)] transition-colors">
                <div className="p-2 rounded-full group-hover:bg-[hsl(201,100%,50%)]/10 transition-colors">
                  <MessageCircle className="w-[18px] h-[18px] text-muted-foreground group-hover:text-[hsl(201,100%,50%)]" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-[hsl(201,100%,50%)]">42</span>
              </button>

              <button className="group flex items-center gap-1 hover:text-[hsl(142,71%,45%)] transition-colors">
                <div className="p-2 rounded-full group-hover:bg-[hsl(142,71%,45%)]/10 transition-colors">
                  <Repeat2 className="w-[18px] h-[18px] text-muted-foreground group-hover:text-[hsl(142,71%,45%)]" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-[hsl(142,71%,45%)]">12</span>
              </button>

              <button className="group flex items-center gap-1 hover:text-[hsl(340,75%,55%)] transition-colors">
                <div className="p-2 rounded-full group-hover:bg-[hsl(340,75%,55%)]/10 transition-colors">
                  <Heart className="w-[18px] h-[18px] text-muted-foreground group-hover:text-[hsl(340,75%,55%)]" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-[hsl(340,75%,55%)]">256</span>
              </button>

              <button className="group flex items-center gap-1 hover:text-[hsl(201,100%,50%)] transition-colors">
                <div className="p-2 rounded-full group-hover:bg-[hsl(201,100%,50%)]/10 transition-colors">
                  <Share className="w-[18px] h-[18px] text-muted-foreground group-hover:text-[hsl(201,100%,50%)]" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
