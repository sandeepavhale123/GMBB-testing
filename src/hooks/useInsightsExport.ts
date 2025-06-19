
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { useToast } from './use-toast';
import html2canvas from 'html2canvas';

export const useInsightsExport = (selectedListing: any, dateRange?: any, customDateRange?: any) => {
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExportImage = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      // Wait a bit to ensure all components are fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: exportRef.current.scrollHeight,
        width: exportRef.current.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        // A4 size optimization
        width: 794, // A4 width in pixels at 96 DPI
        onclone: (clonedDoc) => {
          // Ensure print-only elements are visible in the clone
          const printOnlyElements = clonedDoc.querySelectorAll('.print-only');
          printOnlyElements.forEach((element) => {
            (element as HTMLElement).style.display = 'block';
          });
        }
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `insights-${selectedListing?.name || 'report'}-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Image Export Complete",
        description: "Your insights report has been downloaded as an image."
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

  return {
    isExporting,
    exportRef,
    handleExportImage
  };
};
