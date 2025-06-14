
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MetricsCards } from './MetricsCards';
import { RankingMap } from './RankingMap';
import { UnderPerformingTable } from './UnderPerformingTable';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { FiltersSidebar } from './FiltersSidebar';
import { RankingDistribution } from './RankingDistribution';
import { AIInsights } from './AIInsights';

export const GeoRankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState('Web Design');
  const [gridSize, setGridSize] = useState('4*4');

  const handleCreateReport = () => {
    navigate('/geo-ranking-report');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">GEO Ranking Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor and optimize your local search rankings across different locations</p>
        </div>
        <Button 
          onClick={handleCreateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Create Report
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Section - Main Content */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedKeyword}</h4>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                Monthly Volume: 8.2k
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <MetricsCards />

          {/* Map Section */}
          <RankingMap />

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
    </div>
  );
};
