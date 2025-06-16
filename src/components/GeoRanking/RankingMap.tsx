
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import L from 'leaflet';

export const RankingMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Generate grid overlay data
  const generateGridData = () => {
    const gridData = [];
    const centerLat = 28.6139;
    const centerLng = 77.2090;
    const spacing = 0.005;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const lat = centerLat + (i - 1.5) * spacing;
        const lng = centerLng + (j - 1.5) * spacing;
        const ranking = Math.floor(Math.random() * 15) + 1;
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

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add grid overlay
    const gridData = generateGridData();
    gridData.forEach(point => {
      const color = point.ranking <= 3 ? '#22c55e' : 
                   point.ranking <= 10 ? '#f59e0b' : 
                   point.ranking <= 15 ? '#f97316' : '#ef4444';

      const rankingIcon = L.divIcon({
        html: `<div style="
          background: ${color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${point.ranking}</div>`,
        className: 'custom-ranking-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([point.lat, point.lng], {
        icon: rankingIcon
      }).addTo(map).bindPopup(`
        <div class="text-sm">
          <strong>Position: ${point.ranking}</strong><br>
          Location: Grid ${point.id}
        </div>
      `);
    });

    return () => {
      map.remove();
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, []);

  return (
    <Card className="bg-white">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">GEO Grid Ranking Map</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">Grid Coverage:</span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-medium">16/16 areas</span>
            </div>
          </div>
          
          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 1-3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 4-10</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 11-15</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="whitespace-nowrap">Positions 16+</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div ref={mapRef} className="w-full h-[400px] sm:h-[500px]" />
        </div>
      </CardContent>
    </Card>
  );
};
