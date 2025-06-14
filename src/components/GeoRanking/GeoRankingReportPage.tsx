
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, ArrowLeft, Search, MapPin, Settings, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const GeoRankingReportPage: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
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
        const lat = centerLat + (i - Math.floor(rows/2)) * spacing;
        const lng = centerLng + (j - Math.floor(cols/2)) * spacing;
        // Generate random ranking numbers for demo
        const ranking = Math.floor(Math.random() * 8) + 1;
        gridData.push({ lat, lng, ranking, id: `${i}-${j}` });
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

      L.marker([point.lat, point.lng], { icon: rankingIcon })
        .addTo(map)
        .bindPopup(`Ranking: ${point.ranking}`);
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
    console.log('Creating GEO Report with data:', formData);
    // Handle form submission here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GB</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">GBP Manager</h1>
                <p className="text-xs text-gray-500">Professional Suite</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create GEO Ranking Report</h1>
            <p className="text-gray-600 mt-2">Configure your local search ranking analysis</p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section - Map */}
            <div className="lg:col-span-8">
              <Card className="overflow-hidden h-[680px]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Ranking Grid Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <div 
                    ref={mapRef} 
                    className="w-full h-[600px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Section - Form */}
            <div className="lg:col-span-4">
              <Card className="shadow-lg h-[680px]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Search Business with Type Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Search Business
                      </Label>
                      <div className="flex gap-2">
                        <Select 
                          value={formData.searchBusinessType}
                          onValueChange={(value) => handleInputChange('searchBusinessType', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                            <SelectItem value="cid">CID</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder={`Enter business ${formData.searchBusinessType}`}
                          value={formData.searchBusiness}
                          onChange={(e) => handleInputChange('searchBusiness', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Search Data Engine */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Search Data Engine
                      </Label>
                      <RadioGroup 
                        value={formData.searchDataEngine}
                        onValueChange={(value) => handleInputChange('searchDataEngine', value)}
                        className="flex flex-row gap-6"
                      >
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
                      <Input
                        id="keywords"
                        placeholder="keyword1, keyword2, keyword3"
                        value={formData.keywords}
                        onChange={(e) => handleInputChange('keywords', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Map Point */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Map Point
                      </Label>
                      <Select 
                        value={formData.mapPoint}
                        onValueChange={(value) => handleInputChange('mapPoint', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manually">Manually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Distance Unit */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Distance Unit
                      </Label>
                      <RadioGroup 
                        value={formData.distanceUnit}
                        onValueChange={(value) => handleInputChange('distanceUnit', value)}
                        className="flex flex-row gap-6"
                      >
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

                    {/* Grid Size */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Grid Size
                      </Label>
                      <Select 
                        value={formData.gridSize}
                        onValueChange={(value) => handleInputChange('gridSize', value)}
                      >
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
                      <Select 
                        value={formData.scheduleCheck}
                        onValueChange={(value) => handleInputChange('scheduleCheck', value)}
                      >
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

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Create GEO Report
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
