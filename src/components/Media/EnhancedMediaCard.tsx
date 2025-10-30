import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Loader } from "../ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Star,
  Play,
  FileImage,
} from "lucide-react";
import { formatScheduledDate } from "../../utils/dateUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MediaCardProps {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  size: string;
  uploadDate: string;
  status: "Live" | "Schedule" | "Failed";
  views: string;
  isScheduled?: boolean;
  reason?: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onSetAsCover: () => void;
}
const statusColors = {
  Live: "bg-blue-100 text-blue-800",
  Schedule: "bg-yellow-100 text-yellow-800",
  Failed: "bg-red-100 text-red-800",
};
export const EnhancedMediaCard: React.FC<MediaCardProps> = ({
  id,
  name,
  url,
  type,
  size,
  uploadDate,
  status,
  views,
  isScheduled = false,
  reason,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSetAsCover,
}) => {
  const { t } = useI18nNamespace("Media/enhancedMediaCard");
  const [imageLoading, setImageLoading] = useState(true);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMenuItemClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const getStatusLabel = (status: "Live" | "Schedule" | "Failed") => {
    switch (status) {
      case "Live":
        return t("mediaCard.status.Live");
      case "Schedule":
        return t("mediaCard.status.Schedule");
      case "Failed":
        return t("mediaCard.status.Failed");
      default:
        return status;
    }
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div
        className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
        onClick={onView}
      >
        {/* Loading indicator */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader size="md" />
          </div>
        )}

        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? "none" : "block" }}
        />

        {/* Video indicator */}
        {type === "video" && !imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Status badge */}
        {!imageLoading && (
          <div className="absolute top-2 right-2">
            {status === "Failed" && reason ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={`text-xs ${statusColors[status]} cursor-help`}>
                      {getStatusLabel(status)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">{reason}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Badge className={`text-xs ${statusColors[status]}`}>
                {getStatusLabel(status)}
              </Badge>
            )}
          </div>
        )}

        {/* Action menu */}
        {!imageLoading && (
          <div
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDropdownClick}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white bg-opacity-90 hover:bg-white rounded-full"
                >
                  <MoreVertical className="w-4 h-4 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleMenuItemClick(onView)}>
                  <Eye className="w-4 h-4 mr-1" />
                  {t("mediaCard.actions.view")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleMenuItemClick(onDelete)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("mediaCard.actions.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          {type === "image" ? (
            <FileImage className="w-4 h-4 text-gray-500" />
          ) : (
            <Play className="w-4 h-4 text-gray-500" />
          )}
          <h3 className="font-medium text-sm text-gray-900 truncate flex-1">
            {name}
          </h3>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div>
            {isScheduled
              ? t("mediaCard.labels.scheduled")
              : t("mediaCard.labels.uploaded")}
            {formatScheduledDate(uploadDate)}
          </div>
        </div>
      </div>
    </Card>
  );
};
