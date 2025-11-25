import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Copy, X, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useIsMobile } from "@/hooks/use-mobile";

interface Competitor {
  position: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  selected?: boolean;
}

interface GeoPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpsCoordinates: string;
  competitors: Competitor[];
  userBusinessName?: string;
  loading?: boolean;
}

const GeoPositionModal: React.FC<GeoPositionModalProps> = ({
  isOpen,
  onClose,
  gpsCoordinates,
  competitors,
  userBusinessName,
  loading = false,
}) => {
  const { t } = useI18nNamespace("GeoRanking/geoPositionModal");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile(640);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep modal within viewport bounds
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 500;

      setPosition({
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleCopyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(gpsCoordinates);
      toast({
        title: t("geoPositionModal.toast.copySuccess.title"),
        description: t("geoPositionModal.toast.copySuccess.description"),
      });
    } catch (err) {
      toast({
        title: t("geoPositionModal.toast.copyError.title"),
        description: t("geoPositionModal.toast.copyError.description"),
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 2147483647, // Maximum z-index value
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Backdrop to prevent map interaction */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        style={{ zIndex: 2147483646 }}
        onClick={onClose}
      />

      <Card
        ref={modalRef}
        className="pointer-events-auto shadow-xl border bg-white"
        style={{
          position: "fixed",
          ...(isMobile
            ? {
                // Mobile: centered and full-width with margins
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "calc(100% - 2rem)",
                maxWidth: "384px",
              }
            : {
                // Desktop: draggable positioning
                left: position.x,
                top: position.y,
                cursor: isDragging ? "grabbing" : "grab",
                width: "384px",
              }),
          zIndex: 2147483647,
          maxHeight: "500px",
        }}
      >
        {/* Header - Draggable area */}
        <div
          className={`p-4 border-b bg-white rounded-t-lg ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onMouseDown={!isMobile ? handleMouseDown : undefined}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-700 truncate">
                {gpsCoordinates}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCoordinates}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-0">
          <div className="p-4 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t("geoPositionModal.content.topResult")}
            </h3>
          </div>

          <ScrollArea className="h-80">
            <div className="px-4 pb-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">
                    {t("geoPositionModal.content.loading")}
                  </span>
                </div>
              ) : competitors.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  {t("geoPositionModal.content.noResults")}
                </div>
              ) : (
                competitors.map((competitor) => {
                  const isUserBusiness =
                    competitor.selected || competitor.name === userBusinessName;

                  return (
                    <div
                      key={competitor.position}
                      className={`flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                        isUserBusiness
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg px-3 -mx-1 mb-2 shadow-sm"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Position Avatar */}
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback
                          className={`text-sm font-semibold ${
                            isUserBusiness
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {competitor.position}
                        </AvatarFallback>
                      </Avatar>

                      {/* Business Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`text-sm font-semibold truncate ${
                              isUserBusiness
                                ? "text-blue-900 font-bold"
                                : "text-gray-900"
                            }`}
                          >
                            {competitor.name}
                          </h4>
                          {isUserBusiness && (
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm border border-blue-700">
                              {t("geoPositionModal.content.yourBusiness")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {competitor.address}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex">
                            {renderStars(competitor.rating)}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">
                            {competitor.rating}(
                            {t("geoPositionModal.content.reviews", {
                              count: competitor.reviewCount,
                            })}
                            ){/* ({competitor.reviewCount} reviews) */}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // Use portal to render modal at document body level, completely outside of any parent containers
  return createPortal(modalContent, document.body);
};

export default GeoPositionModal;