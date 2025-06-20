import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MetricsCards } from './MetricsCards';
import { RankingMap } from './RankingMap';
import { UnderPerformingTable } from './UnderPerformingTable';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { FiltersSidebar } from './FiltersSidebar';
import { RankingDistribution } from './RankingDistribution';
import { AIInsights } from './AIInsights';
import { GeoPositionModal } from './GeoPositionModal';

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
    <div className="p-4 sm:p-6 lg:p-8 mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900">{headerKeyword}</h4>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
              Monthly Volume: 8.2k
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
          <Button 
            onClick={handleCreateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Check rank
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Section - Main Content */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <MetricsCards />

          {/* Map Section */}
          <RankingMap onMarkerClick={handleMarkerClick} />

          {/* Under-performing Areas Table */}
          <UnderPerformingTable />

          {/* Competitor Analysis Section */}
          <CompetitorAnalysis />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-6 xl:self-start">
          {/* Filters */}
          <FiltersSidebar 
            selectedKeyword={selectedKeyword}
            setSelectedKeyword={setSelectedKeyword}
            gridSize={gridSize}
            setGridSize={setGridSize}
          />

          {/* Ranking Distribution */}
          <RankingDistribution />

          {/* AI Insights */}
          <AIInsights />
        </div>
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
