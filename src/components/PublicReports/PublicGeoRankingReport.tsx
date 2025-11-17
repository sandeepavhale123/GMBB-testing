import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PublicReportDashboardLayout } from "./PublicReportDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, TrendingUp, Target, Users, Clock } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import L from "leaflet";
import {
  usePerformanceGeoKeywords,
  usePublicGeoRankingReport,
} from "@/hooks/useReports"; // Adjust path as needed
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { applyStoredTheme } from "@/utils/themeUtils";
import { usePublicI18n } from "@/hooks/usePublicI18n";

export const namespaces = ["PublicReports/publicGeoRankingReport"];

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PublicGeoRankingReport: React.FC = () => {
  const { t, loaded, languageFullName } = usePublicI18n(namespaces);
  const [selectedKeywordId, setSelectedKeywordId] = useState<number | null>(
    null
  );
  const [keywordMap, setKeywordMap] = useState<Record<string, number>>({});
  const [selectedKeywordLabel, setSelectedKeywordLabel] = useState("");

  const [selectedKeyword, setSelectedKeyword] = useState("Webdesign");
  const [frequency, setFrequency] = useState("Weekly");

  // Extract reportId from URL
  const reportId = window.location.pathname.split("/").pop() || "";

  // Load theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  const { data: keywordData, isLoading: isKeywordLoading } =
    usePerformanceGeoKeywords(reportId, languageFullName);

  const { data: geoRankingData, isLoading: isGeoLoading } =
    usePublicGeoRankingReport(
      reportId,
      Number(selectedKeywordId) || 0,
      languageFullName
    );

  const reportType = geoRankingData?.data.reportType.toLowerCase();
  // Map refs for individual view
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Map refs for comparison view
  const mapRef1 = useRef<HTMLDivElement>(null);
  const mapInstanceRef1 = useRef<L.Map | null>(null);
  const markersRef1 = useRef<L.Marker[]>([]);

  const mapRef2 = useRef<HTMLDivElement>(null);
  const mapInstanceRef2 = useRef<L.Map | null>(null);
  const markersRef2 = useRef<L.Marker[]>([]);

  const geoData = geoRankingData?.data?.periodOne?.geo_data || [];

  const comparisonData = geoRankingData?.data?.periodTwo?.geo_data || [];
  // Get rank color for grid display
  const getRankingColor = (position: number) => {
    if (position <= 3) return "bg-green-500";
    if (position <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get rank color for map markers (hex colors)
  const getRankColorHex = (rank: string): string => {
    const rankNum = rank === "20+" ? 21 : parseInt(rank);
    if (rankNum <= 3) return "#22c55e"; // Green
    if (rankNum <= 10) return "#f59e0b"; // Yellow
    if (rankNum <= 15) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Clear all markers
  const clearMarkers = (
    mapInstance: React.RefObject<L.Map>,
    markers: React.RefObject<L.Marker[]>
  ) => {
    markers.current.forEach((marker) => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markers.current.length = 0;
  };

  // Add ranking markers
  const addRankingMarkers = (
    mapInstance: React.RefObject<L.Map>,
    markers: React.RefObject<L.Marker[]>,
    data: typeof geoData
  ) => {
    if (!mapInstance.current || !data) return;

    data.forEach((detail, index) => {
      // const [lat, lng] = detail.coordinate.split(",").map(Number);
      const lat = detail?.lat;
      const lng = detail?.lng;
      const rankColor = getRankColorHex(
        detail.rank === 0 ? "20+" : detail.rank
      );

      const rankIcon = L.divIcon({
        html: `<div style="
          background: ${rankColor};
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${detail.rank === 0 ? "20+" : detail.rank ?? 0}
</div>`,
        className: "ranking-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], {
        icon: rankIcon,
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>${t("publicGeoRankingReport.rank")}: ${
        detail.rank === 0 ? "20+" : detail.rank
      }</strong><br>
        </div>
      `);

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    return () => {
      document.querySelector('link[href*="leaflet.css"]')?.remove();
    };
  }, []);

  useEffect(() => {
    const cleanupMap = (
      mapInstanceRef: React.RefObject<L.Map>,
      mapRef: React.RefObject<HTMLDivElement>
    ) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        (mapInstanceRef as any).current = null;
      }

      if (mapRef.current) {
        mapRef.current.innerHTML = "";
        (mapRef.current as any)._leaflet_id = null;
      }
    };

    let map1: L.Map | null = null;
    let map2: L.Map | null = null;

    if (reportType === "individual" && geoData.length > 0) {
      cleanupMap(mapInstanceRef, mapRef);
      map1 = initializeMap(mapRef, mapInstanceRef, markersRef, geoData);
    }

    if (
      reportType === "compare" &&
      geoData.length > 0 &&
      comparisonData.length > 0
    ) {
      cleanupMap(mapInstanceRef1, mapRef1);
      cleanupMap(mapInstanceRef2, mapRef2);

      map1 = initializeMap(mapRef1, mapInstanceRef1, markersRef1, geoData);
      setTimeout(() => {
        map2 = initializeMap(
          mapRef2,
          mapInstanceRef2,
          markersRef2,
          comparisonData
        );
      }, 50);
    }

    // Cleanup on unmount
    return () => {
      cleanupMap(mapInstanceRef, mapRef);
      cleanupMap(mapInstanceRef1, mapRef1);
      cleanupMap(mapInstanceRef2, mapRef2);
    };
  }, [geoData, comparisonData, reportType]);

  // Initialize single map
  const initializeMap = (
    mapRef: React.RefObject<HTMLDivElement>,
    mapInstanceRef: React.RefObject<L.Map>,
    markersRef: React.RefObject<L.Marker[]>,
    data: typeof geoData
  ) => {
    // Check if DOM element exists and is mounted
    if (!mapRef.current) {
      return null;
    }

    // Clean up existing map instance if it exists
    if ((mapInstanceRef as any).current) {
      try {
        (mapInstanceRef as any).current.remove();
      } catch (e) {
        //
      }
      (mapInstanceRef as any).current = null;
    }

    // Clear the DOM container completely
    const container = mapRef.current;
    container.innerHTML = "";
    (container as any)._leaflet_id = null; // Clear Leaflet's internal ID

    try {
      if (
        !data ||
        data.length === 0 ||
        data[0]?.lat === undefined ||
        data[0]?.lng === undefined
      ) {
        // console.warn("Map initialization skipped: Invalid or empty geo_data");
        return null;
      }

      const map = L.map(container).setView([data[0].lat, data[0].lng], 12);

      (mapInstanceRef as any).current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add markers after map is fully initialized
      setTimeout(() => {
        addRankingMarkers(mapInstanceRef, markersRef, data);
      }, 100);

      return map;
    } catch (error) {
      // console.error("Error initializing map:", error);
      return null;
    }
  };
  // keyword handle
  const keywords = keywordData?.data?.keywords ?? [];

  useEffect(() => {
    if (keywords.length) {
      const map: Record<string, number> = {};
      keywords.forEach((item) => {
        map[item.keyword] = Number(item.id);
      });

      setKeywordMap(map);
      const firstKeyword = keywords[0];
      setSelectedKeywordId(firstKeyword.id);
      setSelectedKeywordLabel(firstKeyword.keyword);
      setFrequency(firstKeyword.frequency);
    }
  }, [keywords]);

  // legends
  const legend1 = geoRankingData?.data?.periodOne?.summary?.legend || {};
  const legend2 = geoRankingData?.data?.periodTwo?.summary?.legend || {};
  const rankColors: Record<string, string> = {
    "1-3": "bg-green-500",
    "4-10": "bg-yellow-500",
    "11-15": "bg-orange-500",
    "16-20+": "bg-red-500",
  };

  // Initialize maps based on report type
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Clean up all existing maps first
    const cleanupMap = (
      mapInstanceRef: React.RefObject<L.Map>,
      mapRef: React.RefObject<HTMLDivElement>
    ) => {
      if ((mapInstanceRef as any).current) {
        try {
          (mapInstanceRef as any).current.remove();
        } catch (e) {
          //
        }
        (mapInstanceRef as any).current = null;
      }

      // Clear DOM container
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
        (mapRef.current as any)._leaflet_id = null;
      }
    };

    cleanupMap(mapInstanceRef, mapRef);
    cleanupMap(mapInstanceRef1, mapRef1);
    cleanupMap(mapInstanceRef2, mapRef2);

    let map1: L.Map | null = null;
    let map2: L.Map | null = null;

    // Use setTimeout to ensure DOM elements are ready
    const initMaps = setTimeout(() => {
      if (reportType === "individual") {
        map1 = initializeMap(mapRef, mapInstanceRef, markersRef, geoData);
      } else {
        // Initialize both maps for comparison with additional delay
        map1 = initializeMap(mapRef1, mapInstanceRef1, markersRef1, geoData);
        setTimeout(() => {
          map2 = initializeMap(
            mapRef2,
            mapInstanceRef2,
            markersRef2,
            comparisonData
          );
        }, 50);
      }
    }, 0);

    return () => {
      clearTimeout(initMaps);

      // Cleanup all maps
      cleanupMap(mapInstanceRef, mapRef);
      cleanupMap(mapInstanceRef1, mapRef1);
      cleanupMap(mapInstanceRef2, mapRef2);

      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [reportType]);

  // Update markers when keyword changes
  useEffect(() => {
    // Add delay to ensure maps are fully initialized
    const updateMarkers = setTimeout(() => {
      if (reportType === "individual" && (mapInstanceRef as any).current) {
        clearMarkers(mapInstanceRef, markersRef);
        addRankingMarkers(mapInstanceRef, markersRef, geoData);
      } else if (reportType === "compare") {
        if ((mapInstanceRef1 as any).current) {
          clearMarkers(mapInstanceRef1, markersRef1);
          addRankingMarkers(mapInstanceRef1, markersRef1, geoData);
        }
        if ((mapInstanceRef2 as any).current) {
          clearMarkers(mapInstanceRef2, markersRef2);
          addRankingMarkers(mapInstanceRef2, markersRef2, comparisonData);
        }
      }
    }, 200);

    return () => clearTimeout(updateMarkers);
  }, [selectedKeywordId, geoData, comparisonData, reportType]);

  // Extract visible sections from API response
  const visibleSections = Object.entries(keywordData?.data.visibleSection || {})
    .filter(([_, value]) => value === "1")
    .map(([key]) => key);

  // Handle loading state
  if (isGeoLoading || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            {t("publicGeoRankingReport.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PublicReportDashboardLayout
      title={t("publicGeoRankingReport.title")}
      listingName={geoRankingData?.data.locationName}
      logo={geoRankingData?.data.companyLogo}
      address={geoRankingData?.data.address}
      date={keywordData?.data?.reportDate}
      visibleSections={visibleSections}
      token={reportId}
      compareDate={keywordData?.data?.compareDate}
    >
      <div className="space-y-6">
        {/* First Row - Control Panel */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Column 1: Keyword Selection */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {t("publicGeoRankingReport.controls.selectKeyword")}
                </label>
                <Select
                  value={selectedKeywordId?.toString() || ""}
                  onValueChange={(id) => {
                    const selected = keywords.find(
                      (k) => k.id.toString() === id
                    );
                    if (selected) {
                      setSelectedKeywordId(Number(selected.id));
                      setSelectedKeywordLabel(selected.keyword);
                      setFrequency(selected.frequency);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Keyword" />
                  </SelectTrigger>
                  <SelectContent>
                    {keywords.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Column 2: Overall Visibility */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">
                      {t("publicGeoRankingReport.controls.overallVisibility")}
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {geoRankingData?.data?.periodOne?.summary?.visibility}%
                    </div>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0">
                    <CircularProgress
                      value={Number(
                        geoRankingData?.data?.periodOne?.summary?.visibility ??
                          0
                      )}
                      size={48}
                      className="text-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3: Total Keywords */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">
                  {t("publicGeoRankingReport.controls.totalKeywords")}
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {keywordData?.data?.count}
                </div>
              </div>

              {/* Column 4: Keyword Frequency */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium mb-1">
                    {t("publicGeoRankingReport.controls.reportFrequency")}
                  </div>
                  <div className="text-lg font-bold text-purple-900">
                    {frequency}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Type Toggle */}
        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">GEO Ranking Report</h2>
                <p className="text-muted-foreground mb-1">
                  {formatToDayMonthYear(keywordData?.data?.date_range?.from)} -{" "}
                  {formatToDayMonthYear(keywordData?.data?.date_range?.to)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Keyword:{" "}
                  <span className="font-medium">{selectedKeywordLabel}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    reportType === "individual"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Individual
                </span>
                <Switch
                  checked={reportType === "compare"}
                  onCheckedChange={(checked) =>
                    setReportType(checked ? "compare" : "individual")
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    reportType === "compare"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Comparison
                </span>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* GEO Ranking Report Content */}
        {reportType === "individual" ? (
          <Card>
            <CardContent className="p-6">
              {/* Map Display */}
              <div>
                {geoData?.length === 0 ? (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center">
                      {t("publicGeoRankingReport.chart.noData")}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      ref={mapRef}
                      key={`individual-map-${reportType}`}
                      className="w-full h-[400px] rounded-lg border z-0"
                    />
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-3 rounded-lg shadow-lg border">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        {t("publicGeoRankingReport.chart.rankingLegend")}
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {Object.entries(legend1).map(([range, count]) => (
                          <div
                            key={range}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  rankColors[range] || "bg-gray-400"
                                }`}
                              ></div>
                              <span>{range}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {String(count)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Report Card */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {selectedKeywordLabel}{" "}
                    {geoRankingData?.data?.periodOne?.date?.from_date?.length >
                      0 &&
                      `(${formatToDayMonthYear(
                        geoRankingData.data.periodOne.date.from_date
                      )} - ${formatToDayMonthYear(
                        geoRankingData.data.periodOne.date.to_date
                      )})`}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {t("publicGeoRankingReport.comparison.visibility")}:{" "}
                    {geoRankingData?.data?.periodOne?.summary?.visibility || 0}%
                  </p>
                </div>
                {geoData?.length === 0 ? (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center">
                      {" "}
                      {t("publicGeoRankingReport.chart.noData")}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      ref={mapRef1}
                      key={`comparison-map-1-${reportType}`}
                      className="w-full h-[350px] rounded-lg border z-0"
                    />
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-2 rounded-lg shadow-lg border">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {t("publicGeoRankingReport.chart.legend")}
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {Object.entries(legend1).map(([range, count]) => (
                          <div
                            key={range}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  rankColors[range] || "bg-gray-400"
                                }`}
                              ></div>
                              <span>{range}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {String(count)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Second Report Card */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {selectedKeywordLabel}{" "}
                    {geoRankingData?.data?.periodTwo?.date?.from_date.length >
                      0 &&
                      `(${formatToDayMonthYear(
                        geoRankingData?.data?.periodTwo?.date?.from_date
                      )} - ${formatToDayMonthYear(
                        geoRankingData?.data?.periodTwo?.date?.to_date
                      )})`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("publicGeoRankingReport.comparison.visibility")}:{" "}
                    {geoRankingData?.data?.periodTwo?.summary?.visibility || 0}%
                  </p>
                </div>
                {comparisonData?.length === 0 ? (
                  <div className="flex justify-center flex-col gap-4">
                    <img src="/nodata.svg" alt="No Data" className="h-64" />
                    <p className="text-center">
                      {" "}
                      {t("publicGeoRankingReport.chart.noData")}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      ref={mapRef2}
                      key={`comparison-map-2-${reportType}`}
                      className="w-full h-[350px] rounded-lg border z-0"
                    />
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-2 rounded-lg shadow-lg border">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {t("publicGeoRankingReport.chart.legend")}
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {Object.entries(legend2).map(([range, count]) => (
                          <div
                            key={range}
                            className="flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  rankColors[range] || "bg-gray-400"
                                }`}
                              ></div>
                              <span>{range}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {String(count)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PublicReportDashboardLayout>
  );
};

export default PublicGeoRankingReport;
