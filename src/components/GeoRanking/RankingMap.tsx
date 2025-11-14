import React, { useEffect, useRef, memo } from "react";
import { Card, CardContent } from "../ui/card";
import { RankDetail } from "../../api/geoRankingApi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface RankingMapProps {
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
  rankDetails: RankDetail[];
  centerCoordinates?: string;
}

export const RankingMap: React.FC<RankingMapProps> = memo(
  ({ onMarkerClick, rankDetails = [], centerCoordinates }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    // Memoized function to clear existing markers
    const clearMarkers = () => {
      markersRef.current.forEach((marker) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };

    // Memoized function to add markers
    const addMarkers = (details: RankDetail[]) => {
      if (!mapInstanceRef.current) return;

      clearMarkers();

      details.forEach((detail) => {
        const coords = detail.coordinate.split(",");
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          const ranking = parseInt(detail.rank);

          const color =
            ranking <= 3
              ? "#22c55e"
              : ranking <= 10
              ? "#f59e0b"
              : ranking <= 15
              ? "#f97316"
              : "#ef4444";

          const displayText = ranking >= 20 ? "20+" : ranking.toString();
          const fontSize = ranking >= 20 ? "11px" : "13px";

          const rankingIcon = L.divIcon({
            html: `<div style="
              background: ${color};
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: ${fontSize};
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              cursor: pointer;
            ">${displayText}</div>`,
            className: "custom-ranking-marker",
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });

          const marker = L.marker([lat, lng], {
            icon: rankingIcon,
          }).addTo(mapInstanceRef.current);

          marker.on("click", () => {
            const gpsCoordinates = `${lat.toFixed(13)},${lng.toFixed(13)}`;
            onMarkerClick(gpsCoordinates, detail.positionId);
          });

          markersRef.current.push(marker);
        }
      });
    };

    // Get center coordinates from props or rank details
    const getMapCenter = () => {
      // First priority: centerCoordinates prop
      if (centerCoordinates) {
        const coords = centerCoordinates.split(",");
        if (coords.length === 2) {
          return {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1]),
          };
        }
      }

      // Second priority: first rank detail coordinate
      if (rankDetails.length > 0) {
        const coords = rankDetails[0].coordinate.split(",");
        if (coords.length === 2) {
          return {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1]),
          };
        }
      }

      // Fallback: Delhi coordinates
      return {
        lat: 28.6139,
        lng: 77.209,
      };
    };

    // Initialize map
    useEffect(() => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const center = getMapCenter();

      const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      return () => {
        if (mapInstanceRef.current) {
          clearMarkers();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, []); // Empty dependency array - map initializes only once

    // Update map center when coordinates change
    useEffect(() => {
      if (!mapInstanceRef.current) return;

      const center = getMapCenter();
      mapInstanceRef.current.setView([center.lat, center.lng], 13);
    }, [
      centerCoordinates,
      rankDetails.length > 0 ? rankDetails[0].coordinate : null,
    ]);

    // Update markers when rankDetails change
    useEffect(() => {
      if (!mapInstanceRef.current) return;

      if (rankDetails.length > 0) {
        addMarkers(rankDetails);

        // Auto-fit bounds to show all markers
        const allCoordinates: [number, number][] = [];
        rankDetails.forEach((detail) => {
          const coords = detail.coordinate.split(",");
          if (coords.length === 2) {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            allCoordinates.push([lat, lng]);
          }
        });

        if (allCoordinates.length > 1) {
          const bounds = L.latLngBounds(allCoordinates);
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.fitBounds(bounds, {
                padding: [20, 20],
                maxZoom: 16,
                animate: true,
              });
            }
          }, 100);
        } else if (allCoordinates.length === 1) {
          // For single coordinate, center on it with appropriate zoom
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView(allCoordinates[0], 15, {
                animate: true,
              });
            }
          }, 100);
        }
      } else {
        // Clear markers if no rank details
        clearMarkers();
      }
    }, [rankDetails, onMarkerClick]);

    return (
      <Card className="bg-white">
        <CardContent className="sm:p-0">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-[400px] sm:h-[500px]" />
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if rankDetails or centerCoordinates actually change
    return (
      JSON.stringify(prevProps.rankDetails) ===
        JSON.stringify(nextProps.rankDetails) &&
      prevProps.centerCoordinates === nextProps.centerCoordinates &&
      prevProps.onMarkerClick === nextProps.onMarkerClick
    );
  }
);
