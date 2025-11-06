import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import { MapCoordinates, CircleCoordinate } from "../types/mapCreator.types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MapCreatorMapProps {
  coordinates: MapCoordinates | null;
  radius: string;
  circleCoordinates: CircleCoordinate[];
  isLoadingCircle?: boolean;
}

export const MapCreatorMap: React.FC<MapCreatorMapProps> = ({
  coordinates,
  radius,
  circleCoordinates,
  isLoadingCircle = false,
}) => {
  const { t } = useI18nNamespace("mapCreator-components/MapCreatorMap");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const circleMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [51.505, -0.09],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        circleMarkersRef.current.forEach((marker) => marker.remove());
        circleMarkersRef.current = [];
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !coordinates) return;

    // Validate coordinates before using them
    if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) return;

    // Remove existing marker and circle
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    // Add red marker for business location
    const redIcon = L.divIcon({
      html: '<div style="background: #dc2626; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    markerRef.current = L.marker([coordinates.lat, coordinates.lng], {
      icon: redIcon,
    }).addTo(mapInstanceRef.current);

    // Add green circle for radius if radius > 0
    const radiusValue = parseInt(radius);
    if (radiusValue > 0) {
      circleRef.current = L.circle([coordinates.lat, coordinates.lng], {
        radius: radiusValue,
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(mapInstanceRef.current);

      // Fit bounds to show the entire circle
      const bounds = circleRef.current.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Just center on marker
      mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], 13);
    }
  }, [coordinates, radius]);

  // Handle circle coordinates (distance-based red markers)
  useEffect(() => {
    if (!mapInstanceRef.current || circleCoordinates.length === 0) {
      circleMarkersRef.current.forEach((marker) => marker.remove());
      circleMarkersRef.current = [];
      return;
    }

    circleMarkersRef.current.forEach((marker) => marker.remove());
    circleMarkersRef.current = [];

    const redCircleIcon = L.divIcon({
      html: '<div style="background: #dc2626; width: 30px; height: 30px; border-radius: 50%; border: 1px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
      className: "circle-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    circleCoordinates.forEach((coord) => {
      // Validate coordinates are valid numbers
      if (
        !isNaN(coord.lat) &&
        !isNaN(coord.lng) &&
        isFinite(coord.lat) &&
        isFinite(coord.lng)
      ) {
        const marker = L.marker([coord.lat, coord.lng], {
          icon: redCircleIcon,
        }).addTo(mapInstanceRef.current!);

        circleMarkersRef.current.push(marker);
      }
    });

    if (coordinates && circleCoordinates.length > 0) {
      const bounds = L.latLngBounds(
        circleCoordinates.map((c) => L.latLng(c.lat, c.lng))
      );
      bounds.extend(L.latLng(coordinates.lat, coordinates.lng));
      mapInstanceRef.current!.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [circleCoordinates, coordinates]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border z-[10]">
      <div ref={mapRef} className="w-full h-full z-0" />
      {!coordinates && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
          <p className="text-muted-foreground text-sm">{t("noCoordinates")}</p>
        </div>
      )}
      {isLoadingCircle && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm z-[1000]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">
              {t("loadingCoordinates")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
