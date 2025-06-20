
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, Plus, RefreshCcw, Lightbulb, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MetricsCards } from './MetricsCards';
import { RankingMap } from './RankingMap';
import { UnderPerformingTable } from './UnderPerformingTable';
import { GeoPositionModal } from './GeoPositionModal';
import { Card, CardContent } from '../ui/card';

export const GeoRankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState('Web Design');
  const [gridSize, setGridSize] = useState('4*4');
  const [headerKeyword, setHeaderKeyword] = useState('Web Design');
  
  // Modal state
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    gpsCoordinates: string;
    competitors: Array<{
      position: number;
      name: string;
      address: string;
      rating: number;
      reviewCount: number;
      isUserBusiness?: boolean;
    }>;
  }>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: []
  });

  // User's business name for highlighting
  const userBusinessName = "Your Digital Agency";

  const handleCreateReport = () => {
    navigate('/geo-ranking-report');
  };

  const handleExportPDF = () => {
    console.log('Exporting report as PDF...');
  };

  // Generate mock competitor data based on grid position
  const generateCompetitorData = (gridId: string) => {
    const competitors = [
      { name: 'J K Digitech', address: 'Laxmi Nagar, Delhi, India', rating: 4.8, reviewCount: 127 },
      { name: 'Digital Bytz', address: 'Connaught Place, New Delhi, India', rating: 4.6, reviewCount: 89 },
      { name: 'PUNK DIGITAL MARKETING ACADEMY', address: 'Janakpuri, Delhi, India', rating: 4.7, reviewCount: 156 },
      { name: userBusinessName, address: 'Karol Bagh, Delhi, India', rating: 4.5, reviewCount: 94, isUserBusiness: true },
      { name: 'TechnoVista Digital', address: 'Rajouri Garden, Delhi, India', rating: 4.9, reviewCount: 203 },
      { name: 'Creative Web Hub', address: 'Dwarka, New Delhi, India', rating: 4.4, reviewCount: 78 },
      { name: 'Digital Storm Agency', address: 'Rohini, Delhi, India', rating: 4.6, reviewCount: 112 },
      { name: 'NextGen Web Studio', address: 'Pitampura, Delhi, India', rating: 4.3, reviewCount: 67 },
      { name: 'Elite Digital Services', address: 'Saket, New Delhi, India', rating: 4.8, reviewCount: 145 },
      { name: 'ProWeb Technologies', address: 'Vasant Kunj, Delhi, India', rating: 4.5, reviewCount: 98 }
    ];

    // Shuffle and assign positions based on grid
    const shuffled = [...competitors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10).map((competitor, index) => ({
      position: index + 1,
      ...competitor
    }));
  };

  const handleMarkerClick = (gpsCoordinates: string, gridId: string) => {
    const competitors = generateCompetitorData(gridId);
    setModalData({
      isOpen: true,
      gpsCoordinates,
      competitors
    });
  };

  const handleCloseModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto bg-gray-50 min-h-screen">
      {/* Redesigned Header */}
      <div className="mb-6 sm:mb-8">
        {/* Tool Name and Address */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Selecting Listing Page</h1>
          <p className="text-sm text-gray-600">Your Business Location • Selected Listing Address</p>
        </div>

        {/* Main Header Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 items-start">
              {/* Left Section - Keyword and Details */}
              <div className="xl:col-span-5 space-y-4">
                {/* Keyword Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{headerKeyword}</div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                      Monthly Volume: 8.2k
                    </span>
                  </div>
                  <Select value={headerKeyword} onValueChange={setHeaderKeyword}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Select keyword" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Design">Web Design</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="SEO Services">SEO Services</SelectItem>
                      <SelectItem value="Local Business">Local Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Info Chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    GPS: 28.6139, 77.2090
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    Grid: {gridSize}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    Distance: 2km
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    Engine: Google Maps
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    Frequency: Daily
                  </span>
                </div>
              </div>

              {/* Center Section - Key Metrics */}
              <div className="xl:col-span-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Overall Visibility */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium mb-1">Overall Visibility</div>
                    <div className="text-2xl font-bold text-blue-900">36%</div>
                    <div className="text-xs text-green-600">+5.2% ↑</div>
                  </div>

                  {/* Click Rate */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="text-xs text-orange-600 font-medium mb-1">Click Rate</div>
                    <div className="text-2xl font-bold text-orange-900">12.4%</div>
                    <div className="text-xs text-red-600">-1.2% ↓</div>
                  </div>
                </div>

                {/* KPIs Row */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex rounded-md border overflow-hidden shadow-sm">
                    <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">ARP</div>
                    <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">8.50</div>
                  </div>
                  
                  <div className="flex rounded-md border overflow-hidden shadow-sm">
                    <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">ATRP</div>
                    <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">6.20</div>
                  </div>
                  
                  <div className="flex rounded-md border overflow-hidden shadow-sm">
                    <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">SoLV</div>
                    <div className="bg-white text-gray-800 px-3 py-1 text-xs font-semibold border-l">36.0%</div>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="xl:col-span-3">
                <div className="flex flex-col gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Keyword
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Copy className="w-4 h-4 mr-2" />
                    Clone
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Map Section with Ranking Summary - Now Full Width */}
        <div className="relative">
          <RankingMap onMarkerClick={handleMarkerClick} />
          
          {/* Ranking Summary Overlay */}
          <Card className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Position Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs text-gray-600">1-3</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">2</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs text-gray-600">4-10</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-xs text-gray-600">11-15</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs text-gray-600">16+</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">6</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Under-performing Areas Table */}
        <UnderPerformingTable />
      </div>

      {/* GEO Position Modal */}
      <GeoPositionModal
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        gpsCoordinates={modalData.gpsCoordinates}
        competitors={modalData.competitors}
        userBusinessName={userBusinessName}
      />
    </div>
  );
};
