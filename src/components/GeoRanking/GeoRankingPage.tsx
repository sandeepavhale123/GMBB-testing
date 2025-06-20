
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeoRankingHeader } from './GeoRankingHeader';
import { GeoRankingMapSection } from './GeoRankingMapSection';
import { UnderPerformingTable } from './UnderPerformingTable';
import { SimpleGeoModal } from './SimpleGeoModal';

export const GeoRankingPage = () => {
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState<string>('Web Design');
  const [gridSize, setGridSize] = useState<string>('4*4');
  const [headerKeyword, setHeaderKeyword] = useState<string>('Web Design');
  const [showKeywordDropdown, setShowKeywordDropdown] = useState<boolean>(false);

  const [modalData, setModalData] = useState({
    isOpen: false,
    gpsCoordinates: '',
    competitors: []
  });

  const userBusinessName = "Your Digital Agency";
  
  const handleCreateReport = () => {
    navigate('/geo-ranking-report');
  };
  
  const handleExportPDF = () => {
    console.log('Exporting report as PDF...');
  };

  const generateCompetitorData = (gridId: string) => {
    const baseCompetitors = [{
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
    }];

    return baseCompetitors.slice(0, 5).map((competitor, index) => ({
      ...competitor,
      position: index + 1
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

  const handleToggleDropdown = () => {
    setShowKeywordDropdown(!showKeywordDropdown);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 mx-auto bg-gray-50 min-h-screen">
      <GeoRankingHeader
        headerKeyword={headerKeyword}
        showKeywordDropdown={showKeywordDropdown}
        onToggleDropdown={handleToggleDropdown}
        onKeywordSelect={handleKeywordSelect}
      />

      <div className="space-y-4 sm:space-y-6">
        <GeoRankingMapSection
          gridSize={gridSize}
          onMarkerClick={handleMarkerClick}
        />

        <UnderPerformingTable />
      </div>

      <SimpleGeoModal 
        isOpen={modalData.isOpen} 
        onClose={handleCloseModal} 
        gpsCoordinates={modalData.gpsCoordinates} 
        competitors={modalData.competitors} 
        userBusinessName={userBusinessName} 
      />
    </div>
  );
};
