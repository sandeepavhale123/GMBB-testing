
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, Plus, RefreshCcw, Lightbulb, Copy, ChevronDown } from 'lucide-react';
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
  const [showKeywordDropdown, setShowKeywordDropdown] = useState(false);

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
    const competitors = [{
      name: 'J K Digitech',
      address: 'Laxmi Nagar, Delhi, India',
      rating: 4.8,
      reviewCount: 127
    }, {
      name: 'Digital Bytz',
      address: 'Connaught Place, New Delhi, India',
      rating: 4.6,
      reviewCount: 89
    }, {
      name: 'PUNK DIGITAL MARKETING ACADEMY',
      address: 'Janakpuri, Delhi, India',
      rating: 4.7,
      reviewCount: 156
    }, {
      name: userBusinessName,
      address: 'Karol Bagh, Delhi, India',
      rating: 4.5,
      reviewCount: 94,
      isUserBusiness: true
    }, {
      name: 'TechnoVista Digital',
      address: 'Rajouri Garden, Delhi, India',
      rating: 4.9,
      reviewCount: 203
    }, {
      name: 'Creative Web Hub',
      address: 'Dwarka, New Delhi, India',
      rating: 4.4,
      reviewCount: 78
    }, {
      name: 'Digital Storm Agency',
      address: 'Rohini, Delhi, India',
      rating: 4.6,
      reviewCount: 112
    }, {
      name: 'NextGen Web Studio',
      address: 'Pitampura, Delhi, India',
      rating: 4.3,
      reviewCount: 67
    }, {
      name: 'Elite Digital Services',
      address: 'Saket, New Delhi, India',
      rating: 4.8,
      reviewCount: 145
    }, {
      name: 'ProWeb Technologies',
      address: 'Vasant Kunj, Delhi, India',
      rating: 4.5,
      reviewCount: 98
    }];

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
    setModalData(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleKeywordSelect = (keyword: string) => {
    setHeaderKeyword(keyword);
    setSelectedKeyword(keyword);
    setShowKeywordDropdown(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto bg-gray-50 min-h-screen">
      {/* Redesigned Header to match screenshot */}
      <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border p-6">
        {/* Tool Name and Address */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Citation Builder Pro</h1>
          <p className="text-sm text-gray-600">T 16 Software Technology Park Of India Nargon Road, Opp. Garware Stadium, Chikalthana, MIDC, Chhatrapati Sambhajinagar, Maharashtra 431006</p>
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Section - Keyword and Grid Info */}
          <div className="lg:col-span-4 space-y-4">
            {/* Keyword Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Keyword :</span>
                <div className="relative">
                  <div 
                    className="text-lg font-semibold text-gray-900 flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowKeywordDropdown(!showKeywordDropdown)}
                  >
                    {headerKeyword}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showKeywordDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {/* Keyword Dropdown */}
                  {showKeywordDropdown && (
                    <div className="absolute z-50 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-1">
                        <div 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleKeywordSelect('Web Design')}
                        >
                          Web Design
                        </div>
                        <div 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleKeywordSelect('Digital Marketing')}
                        >
                          Digital Marketing
                        </div>
                        <div 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleKeywordSelect('SEO Services')}
                        >
                          SEO Services
                        </div>
                        <div 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleKeywordSelect('Local Business')}
                        >
                          Local Business
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Grid and GPS Info */}
              <div className="space-y-1 text-sm text-gray-600">
                <div>Grid Size : 5x5</div>
                <div>GPS coordinate : 19.8880285,75.371</div>
              </div>
            </div>
          </div>

          {/* Center Section - Metrics */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Overall Visibility */}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Overall Visibility</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">36%</div>
                <div className="text-xs text-green-600">+5.2% from last month</div>
              </div>

              {/* Click Rate */}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Click Rate</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">12.4%</div>
                <div className="text-xs text-red-600">-1.2% CTR</div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-2">
              {/* Top Row */}
              <Button variant="outline" size="sm" className="text-xs">
                Distance: 500 m
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                GMB Genie AI Insights
              </Button>
              
              {/* Second Row */}
              <Button variant="outline" size="sm" className="text-xs">
                Search Engine: Google Search
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Get AI Recommendations
              </Button>
              
              {/* Third Row */}
              <Button variant="outline" size="sm" className="text-xs">
                Scheduled frequency: onetime
              </Button>
              <div className="grid grid-cols-3 gap-1">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs p-1">
                  <Plus className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" className="text-xs p-1">
                  <RefreshCcw className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" className="text-xs p-1">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Map Section with Overlays - Now Full Width */}
        <div className="relative">
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
                
                {/* Info Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                
                <p className="text-xs text-gray-500 mb-4">Click on any position marker to view detailed competitor rankings</p>
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <RankingMap onMarkerClick={handleMarkerClick} />
              </div>
            </CardContent>
          </Card>
          
          {/* Position Summary Overlay */}
          <Card className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg z-50">
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

          {/* KPI Metrics Overlay */}
          <Card className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm shadow-lg z-50">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Metrics</h3>
              <div className="flex flex-wrap gap-2">
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
            </CardContent>
          </Card>
        </div>

        {/* Under-performing Areas Table */}
        <UnderPerformingTable />
      </div>

      {/* GEO Position Modal */}
      <GeoPositionModal isOpen={modalData.isOpen} onClose={handleCloseModal} gpsCoordinates={modalData.gpsCoordinates} competitors={modalData.competitors} userBusinessName={userBusinessName} />
    </div>
  );
};
