import React from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import {
  KeywordData,
  KeywordDetailsResponse,
  Credits,
} from "../../api/geoRankingApi";
import { HeaderExportActions } from "./HeaderExportActions";
import { KeywordSelector } from "./KeywordSelector";
import { MetricsCards } from "./MetricsCards";
import { CopyUrlModal } from "../Dashboard/CopyUrlModal";
import { useGeoProjects } from "@/modules/GEO-Ranking/hooks/useGeoProjects";

interface GeoRankingHeaderProps {
  keywords: KeywordData[];
  selectedKeyword: string;
  selectedDate: string;
  keywordDetails: KeywordDetailsResponse["data"] | null;
  credits: Credits | null;
  onKeywordChange: (keywordId: string) => void;
  onDateChange: (dateId: string) => void;
  onClone: () => void;
  onRefresh: () => void;
  onCheckRank: () => void;
  isRefreshing: boolean;
  refreshProgress: number;
  loading: boolean;
  keywordChanging: boolean;
  dateChanging: boolean;
  error: string | null;
  isShareableView?: boolean;
  projectName?: string;
  projectId?: number;
  onDeleteSuccess?: () => void;
}

export const GeoRankingHeader: React.FC<GeoRankingHeaderProps> = ({
  keywords,
  selectedKeyword,
  selectedDate,
  keywordDetails,
  credits,
  onKeywordChange,
  onDateChange,
  onClone,
  onRefresh,
  onCheckRank,
  isRefreshing,
  refreshProgress,
  loading,
  keywordChanging,
  dateChanging,
  error,
  isShareableView = false,
  projectName,
  projectId,
  onDeleteSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [isExporting, setIsExporting] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  
  // Get project data to access encKey (fallback for project mode)
  const { projects } = useGeoProjects(!isShareableView);
  const currentProject = projects.find(p => p.id === projectId?.toString());
  
  // Get encKey from keywords data (for listing mode) or project data (for project mode)
  const encKey = keywords.length > 0 ? keywords[0].encKey : currentProject?.encKey;

  // Total keywords count
  const totalKeywords = keywords.length;


  const handleExportImage = async () => {
    const exportElement = document.querySelector(
      "[data-export-target]"
    ) as HTMLElement;
    if (!exportElement) {
      toast({
        title: "Export Failed",
        description: "Could not find the report content to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const tempContainer = document.createElement("div");
      tempContainer.style.padding = "40px";
      tempContainer.style.backgroundColor = "#f9fafb";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = `${exportElement.offsetWidth + 80}px`;

      const clonedElement = exportElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: "#f9fafb",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement("a");
      link.download = `geo-ranking-report-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvas.toDataURL("image/png", 0.95);
      link.click();

      toast({
        title: "Export Complete",
        description:
          "Your geo-ranking report has been downloaded as an image with padding.",
      });
    } catch (error) {
      console.error("Error exporting image:", error);
      toast({
        title: "Export Failed",
        description:
          error?.response?.data?.message ||
          "Failed to export image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const shareableUrl = encKey ? `${window.location.origin}/sharable-geo-ranking-report/${encKey}` : '';

  return (
    <div className="mb-4 sm:mb-4">
      {!isShareableView && (
        <HeaderExportActions
          isExporting={isExporting}
          onExportImage={handleExportImage}
          onCheckRank={onCheckRank}
          onClone={onClone}
          onRefresh={onRefresh}
          onShare={handleShare}
          isRefreshing={isRefreshing}
          credits={credits}
        />
      )}

      {/* Share Modal */}
      <CopyUrlModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        reportUrl={shareableUrl}
      />


      {/* Progress Bar - shown when refreshing */}
      {isRefreshing && (
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Refreshing keyword data...
                </span>
                <span className="text-gray-900 font-medium">
                  {refreshProgress}%
                </span>
              </div>
              <Progress value={refreshProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Header Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-4 items-center">
            <KeywordSelector
              keywords={keywords}
              selectedKeyword={selectedKeyword}
              selectedDate={selectedDate}
              keywordDetails={keywordDetails}
              onKeywordChange={onKeywordChange}
              onDateChange={onDateChange}
              loading={loading}
              keywordChanging={keywordChanging}
              dateChanging={dateChanging}
              isRefreshing={isRefreshing}
              isShareableView={isShareableView}
              listingId={projectId || (listingId ? parseInt(listingId, 10) : 0)}
              onDeleteSuccess={onDeleteSuccess}
            />

            <MetricsCards
              keywordDetails={keywordDetails}
              totalKeywords={totalKeywords}
              onCheckRank={onCheckRank}
              isShareableView={isShareableView}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
