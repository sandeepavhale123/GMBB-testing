import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, RefreshCcw, Copy, ChevronDown, Sparkles, MapPin, Download, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { CircularProgress } from '../ui/circular-progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { KeywordData, KeywordDetailsResponse } from '../../api/geoRankingApi';
import { Loader } from '../ui/loader';

interface GeoRankingHeaderProps {
  keywords: KeywordData[];
  selectedKeyword: string;
  selectedDate: string;
  keywordDetails: KeywordDetailsResponse['data'] | null;
  onKeywordChange: (keywordId: string) => void;
  onDateChange: (dateId: string) => void;
  loading: boolean;
  keywordChanging: boolean;
  dateChanging: boolean;
  error: string | null;
}

export const GeoRankingHeader: React.FC<GeoRankingHeaderProps> = ({
  keywords,
  selectedKeyword,
  selectedDate,
  keywordDetails,
  onKeywordChange,
  onDateChange,
  loading,
  keywordChanging,
  dateChanging,
  error
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter keywords based on search term
  const filteredKeywords = keywords.filter(keyword => 
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const displayedKeywords = searchTerm ? filteredKeywords : keywords.slice(0, 5);

  // Get available dates for the selected keyword
  const availableDates = keywordDetails?.dates || [];

  const handleKeywordSelect = (keywordId: string) => {
    onKeywordChange(keywordId);
    setSearchTerm('');
  };

  const handleCheckRank = () => {
    navigate('/geo-ranking-report');
  };

  const handleExportImage = async () => {
    const exportElement = document.querySelector('[data-export-target]') as HTMLElement;
    if (!exportElement) {
      toast({
        title: "Export Failed",
        description: "Could not find the report content to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const tempContainer = document.createElement('div');
      tempContainer.style.padding = '40px';
      tempContainer.style.backgroundColor = '#f9fafb';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = `${exportElement.offsetWidth + 80}px`;
      
      const clonedElement = exportElement.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#f9fafb',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });
      
      document.body.removeChild(tempContainer);
      
      const link = document.createElement('a');
      link.download = `geo-ranking-report-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
      
      toast({
        title: "Export Complete",
        description: "Your geo-ranking report has been downloaded as an image with padding."
      });
    } catch (error) {
      console.error('Error exporting image:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedKeywordData = keywords.find(k => k.id === selectedKeyword);
  
  // Use ATRP for Overall Visibility as requested
  const overallVisibility = keywordDetails?.rankStats?.atrp || '6.20';
  const visibilityValue = parseFloat(overallVisibility);

  // Total keywords count
  const totalKeywords = keywords.length;

  return (
    <div className="mb-4 sm:mb-4">
      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={handleExportImage} disabled={isExporting} size="sm" variant="outline" className="flex items-center gap-2 ml-auto">
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>

      {/* Main Header Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-center">
            {/* Keyword Section */}
            <div className="lg:col-span-3 relative gap-1">
              <div className="text-sm text-gray-500 font-medium mb-1">Keyword</div>
              <Select value={selectedKeyword} onValueChange={handleKeywordSelect} disabled={loading || keywordChanging}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder={loading ? "Loading keywords..." : "Select keyword"} />
                  {keywordChanging && <Loader size="sm" className="ml-2" />}
                </SelectTrigger>
                <SelectContent>
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search keywords..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                  {displayedKeywords.length > 0 ? (
                    displayedKeywords.map(keyword => (
                      <SelectItem key={keyword.id} value={keyword.id}>
                        {keyword.keyword}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {loading ? "Loading..." : "No keywords found"}
                    </div>
                  )}
                </SelectContent>
              </Select>

              <div>
                <div className="flex items-center gap-2">
                  <div className="w-full">
                    <div className="text-xs text-gray-500 font-medium mb-1">Previous Reports</div>
                    <Select value={selectedDate} onValueChange={onDateChange} disabled={loading || availableDates.length === 0 || dateChanging}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loading ? "Loading dates..." : "Select report date"} />
                        {dateChanging && <Loader size="sm" className="ml-2" />}
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map(date => (
                          <SelectItem key={date.id} value={date.id}>
                            {date.date || `Report ${date.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Visibility Card - Using ATRP */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">Overall Visibility</div>
                    <div className="text-2xl font-bold text-blue-900">{overallVisibility}%</div>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0">
                    <CircularProgress value={visibilityValue} size={48} className="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Keywords Card - Updated from Click Rate */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Total Keywords</div>
                <div className="text-2xl font-bold text-orange-900">{totalKeywords}</div>
                <div className="text-xs text-green-600">Active keywords</div>
              </div>
            </div>

            {/* AI Genie Recommendation Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg">
                <div className="text-xs text-blue-100 font-medium mb-2 text-center">AI Genie Recommendation</div>
                <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50 text-xs font-medium">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Get Insights
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-1">
              <div className="flex flex-col gap-2">
                <Button onClick={handleCheckRank} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Check Rank
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
