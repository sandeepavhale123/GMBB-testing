import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Download, RefreshCcw, Copy, Share } from "lucide-react";
import { Credits } from "../../api/geoRankingApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface HeaderExportActionsProps {
  isExporting: boolean;
  onExportImage: () => void;
  onCheckRank: () => void;
  onClone: () => void;
  onRefresh: () => void;
  onShare: () => void;
  isRefreshing: boolean;
  credits: Credits | null;
}

export const HeaderExportActions: React.FC<HeaderExportActionsProps> = ({
  isExporting,
  onExportImage,
  onCheckRank,
  onClone,
  onRefresh,
  onShare,
  isRefreshing,
  credits,
}) => {
  const { t } = useI18nNamespace("GeoRanking/headerExportActions");
  return (
    <div className="flex justify-end items-center mb-4">
      <div className="flex gap-1 sm:gap-2 items-center overflow-x-auto scrollbar-hide">
        {/* Credits Badge */}
        {credits && (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 h-4 min-h-min py-3 whitespace-nowrap flex items-center"
          >
            {/* Hide "Available credits" below 500px */}
            <span className="hidden [@media(min-width:500px)]:inline mr-2 me-2">
              {t("headerExportActions.credits.label")}
            </span>
            {/* Show coin icon below 500px */}
            <span className="inline [@media(min-width:500px)]:hidden mr-1">
              {t("headerExportActions.credits.icon")}
            </span>{" "}
            {credits.remainingCredit} / {credits.allowedCredit}
          </Badge>
        )}

        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden [@media(min-width:500px)]:inline">
            {isRefreshing
              ? t("headerExportActions.buttons.refresh.loading")
              : t("headerExportActions.buttons.refresh.idle")}
          </span>
        </Button>
        <Button
          onClick={onClone}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden [@media(min-width:500px)]:inline">
            {t("headerExportActions.buttons.clone")}
          </span>
        </Button>

        <Button
          onClick={onShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Share className="w-4 h-4" />
          <span className="hidden [@media(min-width:500px)]:inline">
            {t("headerExportActions.buttons.share")}
          </span>
        </Button>

        <Button
          onClick={onCheckRank}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          {t("headerExportActions.buttons.checkRank")}
        </Button>
        {/* <Button onClick={onExportImage} disabled={isExporting} size="sm" variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button> */}
      </div>
    </div>
  );
};
