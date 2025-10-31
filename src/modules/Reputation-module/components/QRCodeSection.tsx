import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface QRCodeSectionProps {
  title: string;
  description: string;
  downloadButton: string;
  instructions: string;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  title,
  description,
  downloadButton,
  instructions,
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;

    try {
      const canvas = await html2canvas(qrCodeRef.current, {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            {/* QR Code Display */}
            <div
              ref={qrCodeRef}
              className="bg-white p-8 rounded-lg border-2 border-border shadow-sm"
            >
              <div className="w-64 h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-48 h-48 text-primary/30" />
                {/* This is a placeholder - in production, use a real QR code library like 'qrcode.react' */}
              </div>
            </div>

            {/* Instructions */}
            <p className="text-center text-muted-foreground max-w-md">
              {instructions}
            </p>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloadButton}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
