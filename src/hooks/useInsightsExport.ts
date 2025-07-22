import { useState, useRef } from "react";
import { format } from "date-fns";
import { useToast } from "./use-toast";
import html2canvas from "html2canvas";

export const useInsightsExport = (selectedListing: any) => {
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExportImage = async () => {
    if (!exportRef.current) return;

    setIsExporting(true);
    try {
      // Wait a bit to ensure all components are fully rendered
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: exportRef.current.scrollHeight,
        width: exportRef.current.scrollWidth,
        scrollX: 0,
        scrollY: 0,
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `insights-${selectedListing?.name || "report"}-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Image Export Complete",
        description: "Your insights report has been downloaded as an image.",
      });
    } catch (error) {
      console.error("Error exporting image:", error);
      toast({
        title: "Export Failed",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to export image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportRef,
    handleExportImage,
  };
};
