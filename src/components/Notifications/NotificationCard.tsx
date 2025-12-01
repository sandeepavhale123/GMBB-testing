import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Expand, Play, Maximize, Pause } from "lucide-react";
import { Notification, useNotifications } from "@/context/NotificationContext";
import { ImageModal } from "./ImageModal";
import { cn } from "@/lib/utils";
import { transformDescription } from "@/utils/transformDescription";

interface NotificationCardProps {
  notification: Notification;
  onModalOpen?: () => void; // ✅ Added
  onModalClose?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onModalOpen,
  onModalClose,
}) => {
  const { markAsRead } = useNotifications();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const formattedDate = format(new Date(notification.date), "dd MMM yyyy");

  const handleCardClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.notificationUrl) {
      window.open(notification.notificationUrl, "_blank"); // 👈 open in new tab
    }
  };

  const handleImageExpand = (url: string) => {
    setSelectedImage(url);
    onModalOpen?.(); // notify drawer to lock scroll
    // handleCardClick();
  };

  const closeModal = () => {
    setSelectedImage(null);
    onModalClose?.(); // unlock drawer scroll
  };

  // Define colors for each category
  const categoryColors: Record<string, string> = {
    new: "bg-green-100 text-green-800",
    improvement: "bg-blue-100 text-blue-800",
    comingsoon: "bg-yellow-100 text-yellow-800",
    bugfix: "bg-red-100 text-red-800", // optional extra example
  };

  const handleVideoPlay = (ref: React.RefObject<HTMLVideoElement>) => {
    if (!ref.current) return;
    if (ref.current.paused) {
      ref.current.play();
      setIsVideoPlaying(true);
    } else {
      ref.current.pause();
      setIsVideoPlaying(false);
    }
    handleCardClick();
  };

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md my-4",
          !notification.read && "border-primary/50 bg-primary/5"
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm">{formattedDate}</h4>
            {notification.category && (
              <Badge
                variant="default"
                className={`h-5 text-xs capitalize ${
                  categoryColors[notification.category.toLowerCase()] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {notification.category}
              </Badge>
            )}
          </div>

           {/* Render image - prioritize new API single image */}
          {(notification.image || (notification.images && notification.images.length > 0)) && (
            <div
              className="relative group rounded-lg overflow-hidden mb-2 shadow shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              {notification.image ? (
                // New API: Single image
                <>
                  <img
                    src={notification.image}
                    alt={notification.title}
                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageExpand(notification.image!);
                      }}
                    >
                      <Expand className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </>
              ) : (
                // Old API: Image array (backward compatibility)
                notification.images?.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden mb-2 ">
                    <img
                      src={img.url}
                      alt={img.alt ?? ""}
                      className="w-full h-35 object-cover transition-transform duration-200 group-hover:scale-105 "
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageExpand(img.url);
                        }}
                      >
                        <Expand className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Render videos - only for old API (deprecated for new API) */}
          {notification.videos && notification.videos.length > 0 &&
            notification.videos.map((videoHTML, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden mb-2"
                dangerouslySetInnerHTML={{ __html: videoHTML }}
              />
            ))}


          <h3 className="font-semibold mb-2">{notification.title}</h3>

          {/* Render description - prioritize new API shortdesc */}
          {(notification.shortdesc || notification.textContent) && (
            <div className="text-sm text-foreground mb-2">
              {notification.shortdesc ? (
                // New API: Plain text (already cleaned)
                <p>{ (notification.shortdesc.length > 80 ? notification.shortdesc.slice(1 , 80) + "...": notification.shortdesc) }</p>
              ) : (
                // Old API: HTML content
                <div
                  dangerouslySetInnerHTML={{
                    __html: transformDescription(notification.textContent || ""),
                  }}
                />
              )}
            </div>
          )}

         
        </CardContent>
      </Card>
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeModal}
          imageUrl={selectedImage}
          alt=""
        />
      )}
      {/* {notification.type === "image" && notification.media && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={notification.media.url}
          alt={notification.media.alt}
        />
      )} */}
    </>
  );
};
