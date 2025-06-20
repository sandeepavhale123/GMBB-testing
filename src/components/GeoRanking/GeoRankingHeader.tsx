
import React from 'react';
import { Button } from '../ui/button';
import { Plus, RefreshCcw, Copy, ChevronDown, Sparkles, MapPin, Download } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { CircularProgress } from '../ui/circular-progress';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

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
  const [isExporting, setIsExporting] = React.useState(false);

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

  return (
    <div className="mb-4 sm:mb-4">
      {/* Report Header Card */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700">{listingName}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">{listingAddress}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-3 mb-2">
                <Button onClick={handleExportImage} disabled={isExporting} size="sm" variant="outline" className="flex items-center gap-2 ml-auto">
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
              </div>
              <p className="text-sm text-gray-600">Report Generated: {reportDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Header Card - Single Row Layout */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {/* GEO ranking report title */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">GEO ranking report</h1>
          </div>

          {/* Single Row Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Keyword Section */}
            <div className="lg:col-span-3 relative">
              <div className="text-sm text-gray-500 font-medium mb-1">Keyword</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 cursor-pointer" onClick={onToggleDropdown}>
                {headerKeyword}
                <ChevronDown className={`w-5 h-5 transition-transform ${showKeywordDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Keyword Dropdown */}
              {showKeywordDropdown && (
                <div className="absolute z-50 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => onKeywordSelect('Web Design')}>
                      Web Design
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => onKeywordSelect('Digital Marketing')}>
                      Digital Marketing
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => onKeywordSelect('SEO Services')}>
                      SEO Services
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => onKeywordSelect('Local Business')}>
                      Local Business
                    </div>
                  </div>
                </div>
              )}
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
            <div className="lg:col-span-3">
              <div className="flex flex-col gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Keyword
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 justify-center">
                    <RefreshCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 justify-center">
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
