
import React from 'react';
import { Button } from '../ui/button';
import { Plus, RefreshCcw, Copy, ChevronDown, Sparkles, MapPin, Download, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { CircularProgress } from '../ui/circular-progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface GeoRankingHeaderProps {
  headerKeyword: string;
  showKeywordDropdown: boolean;
  onToggleDropdown: () => void;
  onKeywordSelect: (keyword: string) => void;
}

export const GeoRankingHeader: React.FC<GeoRankingHeaderProps> = ({
  headerKeyword,
  showKeywordDropdown,
  onToggleDropdown,
  onKeywordSelect
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedReportDate, setSelectedReportDate] = React.useState('2024-06-30');

  const allKeywords = [
    'Web Design',
    'Digital Marketing', 
    'SEO Services',
    'Local Business',
    'Social Media Marketing',
    'Content Creation',
    'E-commerce Solutions',
    'Mobile App Development',
    'Brand Strategy',
    'Online Advertising'
  ];

  const previousReports = [
    { value: '2024-06-30', label: 'June 30, 2024' },
    { value: '2024-06-23', label: 'June 23, 2024' },
    { value: '2024-06-16', label: 'June 16, 2024' },
    { value: '2024-06-09', label: 'June 9, 2024' },
    { value: '2024-06-02', label: 'June 2, 2024' }
  ];

  const filteredKeywords = allKeywords.filter(keyword =>
    keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedKeywords = searchTerm ? filteredKeywords : allKeywords.slice(0, 5);

  const handleKeywordSelect = (keyword: string) => {
    onKeywordSelect(keyword);
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

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const listingName = "Downtown Coffee Shop";
  const listingAddress = "123 Main St, Downtown, City";

  return <div className="mb-4 sm:mb-4">
      {/* Report Header Card */}
       <div className="flex justify-end mb-4">
          <Button onClick={handleExportImage} disabled={isExporting} size="sm" variant="outline" className="flex items-center gap-2 ml-auto">
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
       </div>

      {/* Main Header Card - Single Row Layout */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* Single Row Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-center">
            {/* Keyword Section */}
            <div className="lg:col-span-3 relative gap-1">
              <div className="text-sm text-gray-500 font-medium mb-1">Keyword</div>
              <Select value={headerKeyword} onValueChange={onKeywordSelect}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select keyword" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {displayedKeywords.length > 0 ? (
                    displayedKeywords.map((keyword) => (
                      <SelectItem key={keyword} value={keyword}>
                        {keyword}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No keywords found
                    </div>
                  )}
                </SelectContent>
              </Select>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700">{listingName}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex-shrink-0"></div>
                  <div className="w-full">
                    <div className="text-xs text-gray-500 font-medium mb-1">Previous Reports</div>
                    <Select value={selectedReportDate} onValueChange={setSelectedReportDate}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select report date" />
                      </SelectTrigger>
                      <SelectContent>
                        {previousReports.map((report) => (
                          <SelectItem key={report.value} value={report.value}>
                            {report.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Visibility Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">Overall Visibility</div>
                    <div className="text-2xl font-bold text-blue-900">36%</div>
                    <div className="text-xs text-green-600">+5.2% ↑</div>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0">
                    <CircularProgress value={36} size={48} className="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Click Rate Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Click Rate</div>
                <div className="text-2xl font-bold text-orange-900">12.4%</div>
                <div className="text-xs text-red-600">-1.2% ↓</div>
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
                <Button 
                  onClick={handleCheckRank}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full" 
                >
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
    </div>;
};
