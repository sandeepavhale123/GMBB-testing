
import React, { useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import { RankDetail } from '../../api/geoRankingApi';
import L from 'leaflet';

interface RankingMapProps {
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
  rankDetails: RankDetail[];
}

export const RankingMap: React.FC<RankingMapProps> = React.memo(({ onMarkerClick, rankDetails }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  console.log('🗺️ RankingMap render', { rankDetailsCount: rankDetails.length });

  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log('🗺️ Initializing map...');

    try {
      // Determine center point from rank details or use default
      let centerLat = 28.6139;
      let centerLng = 77.2090;
      
      if (rankDetails.length > 0) {
        const coords = rankDetails[0].coordinate.split(',');
        if (coords.length === 2) {
          centerLat = parseFloat(coords[0]);
          centerLng = parseFloat(coords[1]);
        }
      }

      const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
      mapInstanceRef.current = map;

      console.log('🗺️ Map initialized successfully', { centerLat, centerLng });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add markers based on API data
      if (rankDetails.length > 0) {
        console.log('🗺️ Adding markers for rank details:', rankDetails.length);
        rankDetails.forEach((detail, index) => {
          const coords = detail.coordinate.split(',');
          if (coords.length === 2) {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            const ranking = parseInt(detail.rank);
            
            const color = ranking <= 3 ? '#22c55e' : 
                         ranking <= 10 ? '#f59e0b' : 
                         ranking <= 15 ? '#f97316' : '#ef4444';

            // Show 20+ for ranks 20 and above
            const displayText = ranking >= 20 ? '20+' : ranking.toString();
            const fontSize = ranking >= 20 ? '11px' : '13px';

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
              className: 'custom-ranking-marker',
              iconSize: [50, 50],
              iconAnchor: [25, 25]
            });

            const marker = L.marker([lat, lng], {
              icon: rankingIcon
            }).addTo(map);

            // Add click handler for modal opening
            marker.on('click', () => {
              const gpsCoordinates = `${lat.toFixed(13)},${lng.toFixed(13)}`;
              onMarkerClick(gpsCoordinates, detail.positionId);
            });

            marker.bindPopup(`
              <div class="text-sm">
                <strong>Position: ${displayText}</strong><br>
                Location: ${detail.coordinate}<br>
                Position ID: ${detail.positionId}<br>
                <em>Click for detailed view</em>
              </div>
            `);
          }
        });
      } else {
        console.log('🗺️ No rank details, generating fallback grid');
        // Fallback to generate dummy grid if no API data
        const generateGridData = () => {
          const gridData = [];
          const spacing = 0.005;

          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              const lat = centerLat + (i - 1.5) * spacing;
              const lng = centerLng + (j - 1.5) * spacing;
              const ranking = Math.floor(Math.random() * 25) + 1;
              gridData.push({
                lat,
                lng,
                ranking,
                id: `${i}-${j}`
              });
            }
          }
          return gridData;
        };

        const gridData = generateGridData();
        gridData.forEach(point => {
          const color = point.ranking <= 3 ? '#22c55e' : 
                       point.ranking <= 10 ? '#f59e0b' : 
                       point.ranking <= 15 ? '#f97316' : '#ef4444';

          const displayText = point.ranking >= 20 ? '20+' : point.ranking.toString();
          const fontSize = point.ranking >= 20 ? '12px' : '14px';

          const rankingIcon = L.divIcon({
            html: `<div style="
              background: ${color};
              color: white;
              width: 50px;
              height: 50px;
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
            className: 'custom-ranking-marker',
            iconSize: [50, 50],
            iconAnchor: [25, 25]
          });

          const marker = L.marker([point.lat, point.lng], {
            icon: rankingIcon
          }).addTo(map);

          marker.on('click', () => {
            const gpsCoordinates = `${point.lat.toFixed(13)},${point.lng.toFixed(13)}`;
            onMarkerClick(gpsCoordinates, point.id);
          });

          marker.bindPopup(`
            <div class="text-sm">
              <strong>Position: ${displayText}</strong><br>
              Location: Grid ${point.id}<br>
              <em>Click for detailed view</em>
            </div>
          `);
        });
      }
    } catch (error) {
      console.error('🗺️ Error initializing map:', error);
    }
  }, [rankDetails, onMarkerClick]);

  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      console.log('🗺️ Cleaning up map...');
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    initializeMap();
    return cleanupMap;
  }, [initializeMap, cleanupMap]);

  return (
    <Card className="bg-white">
      <CardContent className="sm:p-0">
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div 
            ref={mapRef} 
            className="w-full h-[400px] sm:h-[500px]"
            style={{ zIndex: 1 }}
          />
        </div>
      </CardContent>
    </Card>
  );
});
