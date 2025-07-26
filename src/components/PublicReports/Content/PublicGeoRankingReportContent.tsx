import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePerformanceGeoKeywords, usePerformanceGeoRankingReport } from "@/hooks/useReports";
import L from "leaflet";

// Configure Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const PublicGeoRankingReportContent: React.FC = () => {
  const { token } = useParams();
  const reportId = token || "";

  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [selectedKeywordId, setSelectedKeywordId] = useState<string>("");
  const [keywordFrequency, setKeywordFrequency] = useState<string>("");

  // Fetch keywords and geo-ranking data
  const { data: keywordData, isLoading: keywordsLoading } = usePerformanceGeoKeywords(reportId);
  const { data: geoRankingData, isLoading: geoLoading } = usePerformanceGeoRankingReport(reportId, selectedKeywordId || "");

  const reportType = geoRankingData?.data?.reportType?.toLowerCase() || "individual";
  const geoData = geoRankingData?.data?.periodOne?.ranking_data || [];
  const comparisonData = geoRankingData?.data?.periodTwo?.ranking_data || [];

  // Map references
  const mapRef = useRef<HTMLDivElement>(null);
  const comparisonMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const comparisonMapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const comparisonMarkersRef = useRef<L.Marker[]>([]);

  // Process keyword data
  useEffect(() => {
    if (keywordData?.data && Array.isArray(keywordData.data)) {
      const keywordMapping = keywordData.data.reduce((acc: Record<string, string>, item: any) => {
        acc[item.keyword] = item.keyword_id;
        return acc;
      }, {});

      if (keywordData.data.length > 0) {
        const firstKeyword = keywordData.data[0];
        setSelectedKeyword(firstKeyword.keyword);
        setSelectedKeywordId(firstKeyword.keyword_id);
        setKeywordFrequency(firstKeyword.frequency || "");
      }
    }
  }, [keywordData]);

  // Initialize maps
  useEffect(() => {
    if (!geoData || geoData.length === 0) return;

    // Add Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
    link.id = "leaflet-css";
    if (!document.getElementById("leaflet-css")) {
      document.head.appendChild(link);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (comparisonMapInstanceRef.current) {
        comparisonMapInstanceRef.current.remove();
        comparisonMapInstanceRef.current = null;
      }
      markersRef.current = [];
      comparisonMarkersRef.current = [];
    };
  }, [geoData, reportType]);

  // Initialize individual map
  useEffect(() => {
    if (reportType === "individual" && geoData.length > 0 && mapRef.current) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current).setView([40.7128, -74.0060], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      mapInstanceRef.current = map;

      // Add markers
      geoData.forEach((item) => {
        if (item.latitude && item.longitude) {
          const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)])
            .addTo(map)
            .bindPopup(`${item.location_name}: Position ${item.position}`);
          markersRef.current.push(marker);
        }
      });
    }
  }, [geoData, reportType]);

  // Initialize comparison maps
  useEffect(() => {
    if (reportType === "compare" && geoData.length > 0 && mapRef.current && comparisonMapRef.current) {
      // Cleanup existing maps
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (comparisonMapInstanceRef.current) {
        comparisonMapInstanceRef.current.remove();
        comparisonMapInstanceRef.current = null;
      }

      // Initialize first map
      const map1 = L.map(mapRef.current).setView([40.7128, -74.0060], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map1);
      mapInstanceRef.current = map1;

      // Initialize second map
      const map2 = L.map(comparisonMapRef.current).setView([40.7128, -74.0060], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map2);
      comparisonMapInstanceRef.current = map2;

      // Add markers to first map
      geoData.forEach((item) => {
        if (item.latitude && item.longitude) {
          const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)])
            .addTo(map1)
            .bindPopup(`${item.location_name}: Position ${item.position}`);
          markersRef.current.push(marker);
        }
      });

      // Add markers to second map
      comparisonData.forEach((item) => {
        if (item.latitude && item.longitude) {
          const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)])
            .addTo(map2)
            .bindPopup(`${item.location_name}: Position ${item.position}`);
          comparisonMarkersRef.current.push(marker);
        }
      });
    }
  }, [geoData, comparisonData, reportType]);

  if (keywordsLoading || geoLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading geo-ranking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Geo-Ranking Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Keyword</label>
              <Select value={selectedKeyword} onValueChange={(value) => {
                setSelectedKeyword(value);
                const keyword = keywordData?.data?.find((k: any) => k.keyword === value);
                if (keyword) {
                  setSelectedKeywordId(keyword.keyword_id);
                  setKeywordFrequency(keyword.frequency || "");
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a keyword" />
                </SelectTrigger>
                <SelectContent>
                  {keywordData?.data?.map((keyword: any) => (
                    <SelectItem key={keyword.keyword_id} value={keyword.keyword}>
                      {keyword.keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Frequency</label>
              <div className="px-3 py-2 border rounded-md bg-muted">
                {keywordFrequency || "N/A"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <div className="px-3 py-2 border rounded-md bg-muted capitalize">
                {reportType}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maps */}
      {reportType === "individual" ? (
        <Card>
          <CardHeader>
            <CardTitle>Geo-Ranking Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <div ref={mapRef} className="w-full h-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <div ref={mapRef} className="w-full h-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Previous Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <div ref={comparisonMapRef} className="w-full h-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};