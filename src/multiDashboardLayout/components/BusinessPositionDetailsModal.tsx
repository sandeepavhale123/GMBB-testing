import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBusinessPositionDetails } from "@/api/bulkMapRankingBusinessPositionDetailsApi";

interface Competitor {
  position: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  selected?: boolean;
}

interface BusinessPositionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailId: number;
  businessName?: string;
  userBusinessName?: string;
}

export const BusinessPositionDetailsModal: React.FC<
  BusinessPositionDetailsModalProps
> = ({ isOpen, onClose, detailId, businessName, userBusinessName }) => {
  const { t } = useI18nNamespace("BulkMapRanking/businessPositionDetailsModal");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile(640);

  // Fetch data from API
  const { data, isLoading, error } = useBusinessPositionDetails(
    detailId,
    isOpen
  );

  // Transform API response to component data
  const competitors: Competitor[] =
    data?.data?.RankingDetails?.map((detail) => ({
      position: detail.position,
      name: detail.name,
      address: detail.address,
      rating: parseFloat(detail.rating) || 0,
      reviewCount: parseInt(detail.review) || 0,
      selected: detail.selected,
    })) || [];

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

  // Show error toast if API fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch position details. Please try again.",
        variant: "destructive",
      });
      onClose();
    }
  }, [error, toast, onClose]);

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
        zIndex: 2147483647,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Backdrop */}
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
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "calc(100% - 2rem)",
                maxWidth: "384px",
              }
            : {
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
          className={`p-4 border-b bg-white rounded-t-lg ${
            !isMobile ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onMouseDown={!isMobile ? handleMouseDown : undefined}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate flex-1 pr-2">
              {businessName || t("businessPositionDetailsModal.header.title")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
              aria-label={t("businessPositionDetailsModal.header.closeButton")}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-0">
          <div className="p-4 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t("businessPositionDetailsModal.content.topResult")}
            </h3>
          </div>

          <ScrollArea className="h-80">
            <div className="px-4 pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">
                    {t("businessPositionDetailsModal.content.loading")}
                  </span>
                </div>
              ) : competitors.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  {t("businessPositionDetailsModal.content.noResults")}
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
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                          {competitor.position}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                            {competitor.name}
                            {isUserBusiness && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                                {t(
                                  "businessPositionDetailsModal.content.yourBusiness"
                                )}
                              </span>
                            )}
                          </h4>
                        </div>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {competitor.address}
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {renderStars(competitor.rating)}
                            <span className="text-xs font-medium text-gray-700 ml-1">
                              {competitor.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {t("businessPositionDetailsModal.content.reviews", {
                              count: competitor.reviewCount,
                            })}
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

  return createPortal(modalContent, document.body);
};
