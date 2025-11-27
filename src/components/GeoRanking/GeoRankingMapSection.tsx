import React, { useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RankingMap } from "./RankingMap";
import { RankDetail, RankStats, ProjectDetails } from "../../api/geoRankingApi";
import { Loader } from "../ui/loader";
import { Link } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface GeoRankingMapSectionProps {
  gridSize: string;
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
  rankDetails: RankDetail[];
  rankStats?: RankStats;
  projectDetails?: ProjectDetails;
  loading: boolean;
  showKeywordsLink?: boolean;
  listingId?: string | number;
}

export const GeoRankingMapSection: React.FC<GeoRankingMapSectionProps> = memo(
  ({
    gridSize,
    onMarkerClick,
    rankDetails = [],
    rankStats,
    projectDetails,
    loading,
    showKeywordsLink = false,
    listingId,
  }) => {
    const { t } = useI18nNamespace("GeoRanking/GeoRankingMapSection");

    // Memoize position summary calculation
    const positionSummary = useMemo(() => {
      const summary = {
        "1-3": 0,
        "4-10": 0,
        "11-15": 0,
        "16-20+": 0,
      };

      rankDetails.forEach((detail) => {
        const rank = parseInt(detail.rank);
        if (rank >= 1 && rank <= 3) {
          summary["1-3"]++;
        } else if (rank >= 4 && rank <= 10) {
          summary["4-10"]++;
        } else if (rank >= 11 && rank <= 15) {
          summary["11-15"]++;
        } else if (rank >= 16) {
          summary["16-20+"]++;
        }
      });

      return summary;
    }, [rankDetails]);

    // Memoize distance formatting
    const distance = useMemo(() => {
      const formatDistanceLabel = (distance?: string) => {
        if (!distance) return "2km";

        const distanceMap = [
          {
            value: "100",
            label: t("GeoRankingMapSection.distanceMap.label1"),
          },
          { value: "200", label: t("GeoRankingMapSection.distanceMap.label2") },
          { value: "500", label: t("GeoRankingMapSection.distanceMap.label3") },
          { value: "1", label: t("GeoRankingMapSection.distanceMap.label4") },
          { value: "2.5", label: t("GeoRankingMapSection.distanceMap.label5") },
          { value: "5", label: t("GeoRankingMapSection.distanceMap.label6") },
          { value: "10", label: t("GeoRankingMapSection.distanceMap.label7") },
          { value: "25", label: t("GeoRankingMapSection.distanceMap.label8") },
          { value: ".1", label: t("GeoRankingMapSection.distanceMap.label9") },
          {
            value: ".25",
            label: t("GeoRankingMapSection.distanceMap.label10"),
          },
          { value: ".5", label: t("GeoRankingMapSection.distanceMap.label11") },
          {
            value: ".75",
            label: t("GeoRankingMapSection.distanceMap.label12"),
          },
          {
            value: "1mi",
            label: t("GeoRankingMapSection.distanceMap.label13"),
          },
          { value: "2", label: t("GeoRankingMapSection.distanceMap.label14") },
          { value: "3", label: t("GeoRankingMapSection.distanceMap.label15") },
          {
            value: "5mi",
            label: t("GeoRankingMapSection.distanceMap.label16"),
          },
          { value: "8", label: t("GeoRankingMapSection.distanceMap.label17") },
          {
            value: "10mi",
            label: t("GeoRankingMapSection.distanceMap.label18"),
          },
        ];

        const matchedDistance = distanceMap.find(
          (item) => item.value === projectDetails?.distance
        );
        return matchedDistance
          ? matchedDistance.label
          : projectDetails?.distance || "2km";
      };

      return formatDistanceLabel(projectDetails?.distance);
    }, [projectDetails?.distance]);

    // Memoize frequency calculation
    const frequency = useMemo(() => {
      const getFrequency = (schedule?: string) => {
        if (!schedule) return "Daily";
        switch (schedule.toLowerCase()) {
          case "onetime":
            return t("GeoRankingMapSection.frequencyOptions.one");
          case "daily":
            return t("GeoRankingMapSection.frequencyOptions.daily");
          case "weekly":
            return t("GeoRankingMapSection.frequencyOptions.weekly");
          case "monthly":
            return t("GeoRankingMapSection.frequencyOptions.monthly");
          default:
            return schedule;
        }
      };
      return getFrequency(projectDetails?.schedule);
    }, [projectDetails?.schedule]);

    // Memoize grid size formatting
    const formattedGridSize = useMemo(() => {
      const formatGridSize = (grid: string) => {
        const gridNumber = grid.replace(/[^0-9]/g, "");
        return `${gridNumber} * ${gridNumber}`;
      };
      return formatGridSize(gridSize);
    }, [gridSize]);

    // Extract center coordinates from project details
    const centerCoordinates = useMemo(() => {
      return (
        projectDetails?.mappoint ||
        (rankDetails.length > 0 ? rankDetails[0].coordinate : undefined)
      );
    }, [projectDetails?.mappoint, rankDetails]);

    // Memoize GPS coordinates
    const gpsCoordinates = useMemo(() => {
      return rankDetails.length > 0
        ? rankDetails[0].coordinate
        : "28.6139, 77.2090";
    }, [rankDetails]);

    return (
      <div className="relative">
        <Card className="bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {t("GeoRankingMapSection.title")}
                </h3>
                {showKeywordsLink && listingId && (
                  <Link
                    to={`/keywords/${listingId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("GeoRankingMapSection.view")}
                  </Link>
                )}
              </div>

              {/* Info Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {t("GeoRankingMapSection.labels.gps")}: {gpsCoordinates}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {t("GeoRankingMapSection.labels.grid")}: {formattedGridSize}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {t("GeoRankingMapSection.labels.distance")}: {distance}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {t("GeoRankingMapSection.labels.engine")}:{" "}
                  {projectDetails?.sab ||
                    t("GeoRankingMapSection.labels.engineValue")}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {t("GeoRankingMapSection.labels.frequency")}: {frequency}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden relative">
              {loading && (
                <div className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center">
                  <Card className="bg-white shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-center">
                        {t("GeoRankingMapSection.loading.title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col items-center justify-center">
                        <Loader size="lg" />
                        <p className="text-sm text-gray-600 mt-3 text-center">
                          {t("GeoRankingMapSection.loading.description")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              <RankingMap
                onMarkerClick={onMarkerClick}
                rankDetails={rankDetails}
                centerCoordinates={centerCoordinates}
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Overlay - Top Left */}
        <Card
          className="bg-white/95 backdrop-blur-sm shadow-lg z-55 mb-4 lg:absolute lg:mb-0"
          style={{
            top: "120px",
            left: "35px",
            zIndex: "402",
          }}
        >
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex rounded-md border overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
                  {t("GeoRankingMapSection.metrics.arp")}
                </div>
                <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">
                  {rankStats?.atr || "8.50"}
                </div>
              </div>

              <div className="flex rounded-md border overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
                  {t("GeoRankingMapSection.metrics.atrp")}
                </div>
                <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">
                  {rankStats?.atrp || "6.20"}
                </div>
              </div>

              <div className="flex rounded-md border overflow-hidden shadow-sm">
                <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
                  {t("GeoRankingMapSection.metrics.solv")}
                </div>
                <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">
                  {rankStats?.solvability || "36.0"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Summary Overlay - Top Right */}
        <Card
          className="bg-white/95 backdrop-blur-sm shadow-lg  right-[33px] z-[402] lg:absolute"
          style={{ top: "120px" }}
        >
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t("GeoRankingMapSection.positionSummary.title")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600">1-3</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {positionSummary["1-3"]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-gray-600">4-10</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {positionSummary["4-10"]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-xs text-gray-600">11-15</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {positionSummary["11-15"]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600">16-20+</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {positionSummary["16-20+"]}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Prevent re-render during polling by comparing only essential props
    return (
      prevProps.gridSize === nextProps.gridSize &&
      JSON.stringify(prevProps.rankDetails) ===
        JSON.stringify(nextProps.rankDetails) &&
      JSON.stringify(prevProps.rankStats) ===
        JSON.stringify(nextProps.rankStats) &&
      JSON.stringify(prevProps.projectDetails) ===
        JSON.stringify(nextProps.projectDetails) &&
      prevProps.loading === nextProps.loading &&
      prevProps.onMarkerClick === nextProps.onMarkerClick
    );
  }
);
