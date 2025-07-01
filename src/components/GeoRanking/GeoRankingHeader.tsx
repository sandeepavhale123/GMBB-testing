
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { KeywordData, KeywordDetailsResponse, Credits } from '../../api/geoRankingApi';
import { HeaderExportActions } from './HeaderExportActions';
import { KeywordSelector } from './KeywordSelector';
import { MetricsCards } from './MetricsCards';

interface GeoRankingHeaderProps {
  keywords: KeywordData[];
  selectedKeyword: string;
  selectedDate: string;
  keywordDetails: KeywordDetailsResponse['data'] | null;
  credits: Credits | null;
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
  credits,
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

  // Total keywords count
  const totalKeywords = keywords.length;

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

  return (
    <div className="mb-4 sm:mb-4">
      <HeaderExportActions 
        isExporting={isExporting}
        onExportImage={handleExportImage}
        onCheckRank={handleCheckRank}
        credits={credits}
      />

      {/* Main Header Card */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <KeywordSelector
              keywords={keywords}
              selectedKeyword={selectedKeyword}
              selectedDate={selectedDate}
              keywordDetails={keywordDetails}
              onKeywordChange={onKeywordChange}
              onDateChange={onDateChange}
              loading={loading}
              keywordChanging={keywordChanging}
              dateChanging={dateChanging}
            />

            <MetricsCards
              keywordDetails={keywordDetails}
              totalKeywords={totalKeywords}
              onCheckRank={handleCheckRank}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
