import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Palette } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface QRCodeSectionProps {
  title: string;
  description: string;
  simpleCard: {
    title: string;
    description: string;
    downloadButton: string;
  };
  posterCard: {
    title: string;
    description: string;
    customizeButton: string;
  };
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  title,
  description,
  simpleCard,
  posterCard,
}) => {
  const simpleQrRef = useRef<HTMLDivElement>(null);
  const posterQrRef = useRef<HTMLDivElement>(null);

  const handleDownloadSimple = async () => {
    if (!simpleQrRef.current) return;

    try {
      const canvas = await html2canvas(simpleQrRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `review-qr-code-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("QR Code downloaded successfully");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const handleCustomizePoster = () => {
    toast.info("Poster customization feature coming soon!", {
      description: "You'll be able to add your logo, customize colors, and add custom text.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Card 1: Simple QR Code Download */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: QR Code Preview (30% on desktop) */}
            <div className="w-full lg:w-[30%] flex-shrink-0">
              <div
                ref={simpleQrRef}
                className="bg-white p-6 rounded-lg border-2 border-border shadow-sm aspect-square flex items-center justify-center"
              >
                <QrCode className="w-full h-full max-w-[200px] max-h-[200px] text-primary/30" />
              </div>
            </div>

            {/* Right Column: Content (70% on desktop) */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {simpleCard.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {simpleCard.description}
                </p>
              </div>
              <div>
                <Button
                  onClick={handleDownloadSimple}
                  className="bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {simpleCard.downloadButton}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Custom QR Poster */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Poster Preview (30% on desktop) */}
            <div className="w-full lg:w-[30%] flex-shrink-0">
              <div
                ref={posterQrRef}
                className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 rounded-lg border-2 border-border shadow-sm aspect-square flex flex-col items-center justify-center gap-3"
              >
                {/* Mock Poster Design */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-primary/60 mb-2">
                    ⭐ Leave a Review ⭐
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <QrCode className="w-24 h-24 text-primary/40" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">
                    Scan to share your experience
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Content (70% on desktop) */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {posterCard.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {posterCard.description}
                </p>
              </div>
              <div>
                <Button
                  onClick={handleCustomizePoster}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  size="lg"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  {posterCard.customizeButton}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
