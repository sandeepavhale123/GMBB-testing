import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Target, Eye, Share2 } from "lucide-react";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { GeoRankingMapSection } from "@/components/GeoRanking/GeoRankingMapSection";
import { UnderPerformingTable } from "@/components/GeoRanking/UnderPerformingTable";
import { GeoPositionModal } from "@/components/GeoRanking/GeoPositionModal";
import { usePublicGeoRankingReport, usePerformanceGeoKeywords } from "@/hooks/useReports";
import { toast } from "sonner";

interface ModalData {
  isOpen: boolean;
  gps: string;
  competitors: Array<{
    position: number;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
  }>;
  loading: boolean;
}

export const ShareableGeoRankingReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [selectedKeywordId, setSelectedKeywordId] = useState<number | null>(null);
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gps: "",
    competitors: [],
    loading: false,
  });

  // Fetch keywords and geo ranking data
  const { data: keywordsData, isLoading: keywordsLoading } = usePerformanceGeoKeywords(reportId || "");
  const { data: geoData, isLoading: geoLoading } = usePublicGeoRankingReport(
    reportId || "",
    selectedKeywordId || 0
  );

  // Auto-select first keyword when data loads
  useEffect(() => {
    if (keywordsData?.data && keywordsData.data.length > 0 && !selectedKeywordId) {
      setSelectedKeywordId(keywordsData.data[0].id);
    }
  }, [keywordsData, selectedKeywordId]);

  const handleKeywordSelect = (keywordId: number) => {
    setSelectedKeywordId(keywordId);
  };

  const handleMarkerClick = async (gps: string) => {
    setModalData({
      isOpen: true,
      gps,
      competitors: [],
      loading: true,
    });

    try {
      // Mock competitor data - in real implementation, this would be an API call
      setTimeout(() => {
        setModalData({
          isOpen: true,
          gps,
          competitors: [
            { position: 1, name: "Example Business", address: "123 Main St", rating: 4.5, reviewCount: 150 },
            { position: 2, name: "Competitor A", address: "456 Oak Ave", rating: 4.2, reviewCount: 98 },
            { position: 3, name: "Competitor B", address: "789 Pine Rd", rating: 4.0, reviewCount: 75 },
          ],
          loading: false,
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to load competitor data");
      setModalData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseModal = () => {
    setModalData({
      isOpen: false,
      gps: "",
      competitors: [],
      loading: false,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied to clipboard!");
  };

  if (keywordsLoading) {
    return (
      <PublicReportDashboardLayout
        title="GEO Ranking Report"
        listingName="Business Name"
        address="Loading..."
        logo=""
        token={reportId || ""}
        date={new Date().toLocaleDateString()}
        visibleSections={["geo-ranking"]}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading report data...</p>
          </div>
        </div>
      </PublicReportDashboardLayout>
    );
  }

  if (!keywordsData?.data || keywordsData.data.length === 0) {
    return (
      <PublicReportDashboardLayout
        title="GEO Ranking Report"
        listingName="Business Name"
        address="No data available"
        logo=""
        token={reportId || ""}
        date={new Date().toLocaleDateString()}
        visibleSections={["geo-ranking"]}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No GEO Ranking Data Available</h3>
            <p className="text-muted-foreground">This report doesn't contain any GEO ranking information.</p>
          </div>
        </div>
      </PublicReportDashboardLayout>
    );
  }

  return (
    <PublicReportDashboardLayout
      title="GEO Ranking Report"
      listingName={geoData?.project_details?.business_name || "Business"}
      address={geoData?.project_details?.business_address || "Address not available"}
      logo={geoData?.project_details?.logo || ""}
      token={reportId || ""}
      date={new Date().toLocaleDateString()}
      visibleSections={["geo-ranking"]}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold">GEO Ranking Report</h1>
              </div>
              <p className="text-muted-foreground">
                Interactive geographical ranking analysis for your business keywords
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Report
              </Button>
              <Badge variant="secondary" className="gap-1">
                <Eye className="h-3 w-3" />
                Public View
              </Badge>
            </div>
          </div>
        </Card>

        {/* Keywords Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Select Keyword</h2>
          <div className="flex flex-wrap gap-2">
            {keywordsData.data.map((keyword) => (
              <Button
                key={keyword.id}
                variant={selectedKeywordId === keyword.id ? "default" : "outline"}
                onClick={() => handleKeywordSelect(keyword.id)}
                size="sm"
              >
                {keyword.keyword}
              </Button>
            ))}
          </div>
        </Card>

        {/* Map and Stats Section */}
        {selectedKeywordId && (
          <>
            {geoLoading ? (
              <Card className="p-6">
                <div className="flex items-center justify-center h-[400px]">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading ranking data...</p>
                  </div>
                </div>
              </Card>
            ) : geoData ? (
              <>
                <GeoRankingMapSection
                  gridSize={geoData.grid_size || 5}
                  onMarkerClick={handleMarkerClick}
                  rankDetails={geoData.rank_details || []}
                  rankStats={geoData.rank_stats}
                  projectDetails={geoData.project_details}
                  loading={false}
                />

                {/* Under Performing Areas */}
                {geoData.under_performing_areas && geoData.under_performing_areas.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Under Performing Areas</h2>
                    <UnderPerformingTable underPerformingAreas={geoData.under_performing_areas} />
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-6">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Ranking Data</h3>
                  <p className="text-muted-foreground">
                    No ranking data available for the selected keyword.
                  </p>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Position Details Modal */}
        <GeoPositionModal
          isOpen={modalData.isOpen}
          onClose={handleCloseModal}
          gpsCoordinates={modalData.gps}
          competitors={modalData.competitors}
          loading={modalData.loading}
        />
      </div>
    </PublicReportDashboardLayout>
  );
};