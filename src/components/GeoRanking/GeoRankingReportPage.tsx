import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, MapPin, ArrowLeft } from 'lucide-react';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});
export const GeoRankingReportPage: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    searchBusinessType: 'name',
    searchBusiness: '',
    searchDataEngine: 'Map API',
    keywords: '',
    mapPoint: 'Automatic',
    distanceUnit: 'Meters',
    gridSize: '5x5',
    scheduleCheck: 'One-time'
  });

  // Generate grid overlay data
  const generateGridData = (gridSize: string) => {
    const [rows, cols] = gridSize.split('x').map(Number);
    const gridData = [];
    const centerLat = 28.6139;
    const centerLng = 77.2090;
    const spacing = 0.003; // Adjust spacing as needed

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const lat = centerLat + (i - Math.floor(rows / 2)) * spacing;
        const lng = centerLng + (j - Math.floor(cols / 2)) * spacing;
        // Generate random ranking numbers for demo
        const ranking = Math.floor(Math.random() * 8) + 1;
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
    // Load Leaflet CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add grid overlay
    const gridData = generateGridData(formData.gridSize);
    gridData.forEach(point => {
      // Create custom marker with ranking number
      const rankingIcon = L.divIcon({
        html: `<div style="
          background: ${point.ranking === 1 ? '#22c55e' : point.ranking <= 3 ? '#f59e0b' : point.ranking <= 6 ? '#ef4444' : '#94a3b8'};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${point.ranking}</div>`,
        className: 'custom-ranking-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker([point.lat, point.lng], {
        icon: rankingIcon
      }).addTo(map).bindPopup(`Ranking: ${point.ranking}`);
    });
    return () => {
      map.remove();
      // Clean up the CSS link when component unmounts
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [formData.gridSize]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checking GEO ranking with data:', formData);
    // Navigate to geo ranking page
    navigate('/');
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleBackClick = () => {
    navigate('/');
  };
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return <div className="min-h-screen flex w-full">
      <Sidebar activeTab="geo-ranking" onTabChange={() => {}} collapsed={sidebarCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} title="Check GEO Ranking" />
        
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header with Back Button */}
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center gap-4 mb-2">
                <Button variant="outline" size="sm" onClick={handleBackClick} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                
              </div>
              <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">Configure your local search ranking analysis</p>
            </div>

            {/* Main Layout - Responsive Order */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
              {/* Report Configuration - Shows first on mobile */}
              <div className="xl:col-span-4 order-1 xl:order-2">
                <Card className="shadow-lg h-[400px] sm:h-[500px] lg:h-[680px]">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                      Report Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6 overflow-y-auto h-full pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                      {/* Search Business with Type Dropdown */}

                      {/* Keywords */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                            Keywords
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add up to 5 keywords separated by commas</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input id="keywords" placeholder="keyword1, keyword2, keyword3" value={formData.keywords} onChange={e => handleInputChange('keywords', e.target.value)} className="w-full" />
                      </div>
                      

                      {/* Search Data Engine */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Search Data Engine
                        </Label>
                        <RadioGroup value={formData.searchDataEngine} onValueChange={value => handleInputChange('searchDataEngine', value)} className="flex flex-row gap-4 sm:gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Map API" id="map-api" />
                            <Label htmlFor="map-api" className="text-sm">Map API</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Briefcase API" id="briefcase-api" />
                            <Label htmlFor="briefcase-api" className="text-sm">Briefcase API</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      

                      {/* Map Point - Separate Row */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Map Point
                        </Label>
                        <Select value={formData.mapPoint} onValueChange={value => handleInputChange('mapPoint', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manually">Manually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Distance Unit - Separate Row */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Distance Unit
                        </Label>
                        <RadioGroup value={formData.distanceUnit} onValueChange={value => handleInputChange('distanceUnit', value)} className="flex flex-row gap-3 lg:gap-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Meters" id="meters" />
                            <Label htmlFor="meters" className="text-sm">Meters</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Miles" id="miles" />
                            <Label htmlFor="miles" className="text-sm">Miles</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      

                      {/* Grid Size and Schedule Check in Single Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        {/* Grid Size */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Grid Size
                          </Label>
                          <Select value={formData.gridSize} onValueChange={value => handleInputChange('gridSize', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3x3">3x3</SelectItem>
                              <SelectItem value="5x5">5x5</SelectItem>
                              <SelectItem value="7x7">7x7</SelectItem>
                              <SelectItem value="9x9">9x9</SelectItem>
                              <SelectItem value="11x11">11x11</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Schedule Check */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Schedule Check
                          </Label>
                          <Select value={formData.scheduleCheck} onValueChange={value => handleInputChange('scheduleCheck', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="One-time">One-time</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
                        Check rank
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map Section - Shows second on mobile */}
              <div className="xl:col-span-8 order-2 xl:order-1">
                <Card className="overflow-hidden h-[400px] sm:h-[500px] lg:h-[680px]">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                      Ranking Grid Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div ref={mapRef} className="w-full h-[330px] sm:h-[430px] lg:h-[600px]" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};