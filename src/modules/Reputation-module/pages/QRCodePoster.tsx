import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Download, Upload, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const DEFAULT_SETTINGS = {
  businessName: "Your Business Name",
  keywords: "Scan to leave us a review!",
  backgroundColor: "#FEF3C7",
  textColor: "#92400E",
  accentColor: "#F59E0B",
  qrCodeUrl: window.location.origin + "/review-feedback",
  qrCodeSize: 200,
  showScanText: true,
};

const COLOR_PRESETS = [
  { name: "Professional", bg: "#FFFFFF", text: "#1F2937", accent: "#3B82F6" },
  { name: "Modern", bg: "#F9FAFB", text: "#111827", accent: "#8B5CF6" },
  { name: "Vibrant", bg: "#FEF3C7", text: "#92400E", accent: "#F59E0B" },
  { name: "Minimal", bg: "#F3F4F6", text: "#374151", accent: "#6B7280" },
];

// Poster dimensions (18" × 24" at 300 DPI)
const POSTER_DPI = 300;
const POSTER_WIDTH_INCHES = 18;
const POSTER_HEIGHT_INCHES = 24;
const POSTER_WIDTH_PX = POSTER_WIDTH_INCHES * POSTER_DPI; // 5400px
const POSTER_HEIGHT_PX = POSTER_HEIGHT_INCHES * POSTER_DPI; // 7200px

// Helper function to load images
const loadImageAsync = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Helper function for text wrapping
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
};

// Helper function for rounded rectangles
const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// Generate QR code as canvas using ReactDOM
const generateQRCanvas = async (url: string, size: number): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    canvas.width = size;
    canvas.height = size;

    // Create a temporary container for the QR code SVG
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = `${size}px`;
    tempContainer.style.height = `${size}px`;
    document.body.appendChild(tempContainer);

    // Create SVG element using qrcode.react
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", size.toString());
    svg.setAttribute("height", size.toString());
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    tempContainer.appendChild(svg);

    // Use qrcode.react library's rendering
    import("qrcode")
      .then((QRCode) => {
        QRCode.toDataURL(url, {
          width: size,
          margin: 0,
          errorCorrectionLevel: "H",
        })
          .then((dataUrl) => {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, size, size);
              document.body.removeChild(tempContainer);
              resolve(canvas);
            };
            img.onerror = () => {
              document.body.removeChild(tempContainer);
              reject(new Error("Failed to load QR code image"));
            };
            img.src = dataUrl;
          })
          .catch((error) => {
            document.body.removeChild(tempContainer);
            reject(error);
          });
      })
      .catch((error) => {
        document.body.removeChild(tempContainer);
        reject(error);
      });
  });
};

export const QRCodePoster: React.FC = () => {
  const { t } = useTranslation("Reputation/qrCodePoster");
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState(DEFAULT_SETTINGS.businessName);
  const [keywords, setKeywords] = useState(DEFAULT_SETTINGS.keywords);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_SETTINGS.backgroundColor);
  const [textColor, setTextColor] = useState(DEFAULT_SETTINGS.textColor);
  const [accentColor, setAccentColor] = useState(DEFAULT_SETTINGS.accentColor);
  const [qrCodeUrl, setQrCodeUrl] = useState(DEFAULT_SETTINGS.qrCodeUrl);
  const [qrCodeSize, setQrCodeSize] = useState([DEFAULT_SETTINGS.qrCodeSize]);
  const [showScanText, setShowScanText] = useState(DEFAULT_SETTINGS.showScanText);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("toast.logoTooLarge"));
      return;
    }

    // Validate file type
    if (!["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(file.type)) {
      toast.error(t("toast.invalidFormat"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderPosterToCanvas = async (canvas: HTMLCanvasElement, scale: number = 1): Promise<void> => {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    // Set canvas dimensions
    canvas.width = POSTER_WIDTH_PX * scale;
    canvas.height = POSTER_HEIGHT_PX * scale;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate proportional spacing
    const padding = 360 * scale; // 12% padding
    const logoSize = 960 * scale; // Logo area
    const qrSize = qrCodeSize[0] * scale * 3; // Scale QR code for print
    const spacing = 240 * scale; // Space between elements

    let yPosition = padding;

    // Draw logo if exists
    if (logo) {
      try {
        const logoImg = await loadImageAsync(logo);
        const logoAspect = logoImg.width / logoImg.height;
        let drawWidth = logoSize;
        let drawHeight = logoSize;

        if (logoAspect > 1) {
          drawHeight = logoSize / logoAspect;
        } else {
          drawWidth = logoSize * logoAspect;
        }

        const logoX = (canvas.width - drawWidth) / 2;
        ctx.drawImage(logoImg, logoX, yPosition, drawWidth, drawHeight);
        yPosition += logoSize + spacing;
      } catch (error) {
        console.error("Error loading logo:", error);
        yPosition += spacing;
      }
    }

    // Draw business name
    ctx.fillStyle = textColor;
    ctx.font = `bold ${120 * scale}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Handle multi-line text if too long
    const maxWidth = canvas.width - padding * 2;
    wrapText(ctx, businessName, canvas.width / 2, yPosition, maxWidth, 140 * scale);
    yPosition += 200 * scale;

    // Draw QR code background
    const qrPadding = 60 * scale;
    const qrBgSize = qrSize + qrPadding * 2;
    const qrBgX = (canvas.width - qrBgSize) / 2;

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 20 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10 * scale;

    roundRect(ctx, qrBgX, yPosition, qrBgSize, qrBgSize, 24 * scale);
    ctx.fill();
    ctx.shadowColor = "transparent";

    // Draw QR code
    try {
      const qrCanvas = await generateQRCanvas(qrCodeUrl, qrSize);
      const qrX = (canvas.width - qrSize) / 2;
      ctx.drawImage(qrCanvas, qrX, yPosition + qrPadding, qrSize, qrSize);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }

    yPosition += qrBgSize + spacing;

    // Draw scan text
    if (showScanText) {
      ctx.fillStyle = textColor;
      ctx.font = `${60 * scale}px Arial, sans-serif`;
      ctx.textAlign = "center";
      wrapText(ctx, keywords, canvas.width / 2, yPosition, maxWidth, 80 * scale);
      yPosition += 160 * scale;
    }

    // Draw stars
    const starSize = 90 * scale;
    const starSpacing = 60 * scale;
    const totalStarWidth = starSize * 5 + starSpacing * 4;
    let starX = (canvas.width - totalStarWidth) / 2;

    ctx.fillStyle = accentColor;
    ctx.font = `${starSize}px Arial`;
    ctx.textBaseline = "middle";

    for (let i = 0; i < 5; i++) {
      ctx.fillText("★", starX, yPosition);
      starX += starSize + starSpacing;
    }
  };

  const handleDownload = async (format: "png" | "pdf") => {
    if (!hiddenCanvasRef.current) return;

    try {
      // Render full resolution to hidden canvas
      await renderPosterToCanvas(hiddenCanvasRef.current, 1);

      const dataUrl = hiddenCanvasRef.current.toDataURL("image/png", 1.0);

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `qr-poster-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [POSTER_WIDTH_INCHES, POSTER_HEIGHT_INCHES],
        });

        pdf.addImage(dataUrl, "PNG", 0, 0, POSTER_WIDTH_INCHES, POSTER_HEIGHT_INCHES, undefined, "FAST");

        pdf.save(`qr-poster-${Date.now()}.pdf`);
      }

      toast.success(t("toast.downloadSuccess"));
    } catch (error) {
      console.error("Download error:", error);
      toast.error(t("toast.downloadError"));
    }
  };

  const handleReset = () => {
    setLogo(null);
    setBusinessName(DEFAULT_SETTINGS.businessName);
    setKeywords(DEFAULT_SETTINGS.keywords);
    setBackgroundColor(DEFAULT_SETTINGS.backgroundColor);
    setTextColor(DEFAULT_SETTINGS.textColor);
    setAccentColor(DEFAULT_SETTINGS.accentColor);
    setQrCodeUrl(DEFAULT_SETTINGS.qrCodeUrl);
    setQrCodeSize([DEFAULT_SETTINGS.qrCodeSize]);
    setShowScanText(DEFAULT_SETTINGS.showScanText);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success(t("toast.resetSuccess"));
  };

  const applyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
    setAccentColor(preset.accent);
  };

  // Update preview canvas whenever settings change
  useEffect(() => {
    if (previewCanvasRef.current) {
      // Scale down to preview size (0.1 for 540×720 preview)
      const previewScale = 0.1;
      renderPosterToCanvas(previewCanvasRef.current, previewScale).catch(console.error);
    }
  }, [logo, businessName, keywords, backgroundColor, textColor, accentColor, qrCodeUrl, qrCodeSize, showScanText]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Customization Options (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t("leftPanel.logo.title")}</h3>

              <div className="space-y-3">
                {logo ? (
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Logo preview"
                      className="w-full h-32 object-contain border-2 border-border rounded-lg p-2 bg-muted"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveLogo}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("leftPanel.logo.dragDrop")}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      {t("leftPanel.logo.browse")}
                    </Button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t("leftPanel.business.title")}</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="businessName">{t("leftPanel.business.nameLabel")}</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    maxLength={50}
                    placeholder={t("leftPanel.business.namePlaceholder")}
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">{t("leftPanel.business.keywordsLabel")}</Label>
                  <Input
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    maxLength={100}
                    placeholder={t("leftPanel.business.keywordsPlaceholder")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t("leftPanel.colors.title")}</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="backgroundColor">{t("leftPanel.colors.background")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">{t("leftPanel.colors.text")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">{t("leftPanel.colors.accent")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div>
                  <Label>{t("leftPanel.colors.presets")}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {COLOR_PRESETS.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="justify-start"
                      >
                        <div className="flex gap-1 mr-2">
                          <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.bg }} />
                          <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.accent }} />
                        </div>
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t("leftPanel.qrCode.title")}</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="qrCodeUrl">{t("leftPanel.qrCode.urlLabel")}</Label>
                  <Input id="qrCodeUrl" value={qrCodeUrl} onChange={(e) => setQrCodeUrl(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="qrCodeSize">
                    {t("leftPanel.qrCode.sizeLabel")}: {qrCodeSize[0]}px
                  </Label>
                  <Slider
                    id="qrCodeSize"
                    value={qrCodeSize}
                    onValueChange={setQrCodeSize}
                    min={150}
                    max={300}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showScanText">{t("leftPanel.qrCode.showScanText")}</Label>
                  <Switch id="showScanText" checked={showScanText} onCheckedChange={setShowScanText} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button onClick={() => handleDownload("png")} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                {t("leftPanel.actions.download")} (PNG)
              </Button>
              <Button onClick={() => handleDownload("pdf")} variant="outline" className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                {t("leftPanel.actions.download")} (PDF)
              </Button>
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("leftPanel.actions.reset")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Poster Preview (60%) */}
        <div className="lg:col-span-3">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{t("rightPanel.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("rightPanel.subtitle")}</p>
              </div>

              {/* Poster Preview Container - 18x24 aspect ratio (3:4) */}
              <div className="w-full aspect-[3/4] border-2 border-border rounded-lg shadow-lg overflow-hidden bg-muted">
                <canvas ref={previewCanvasRef} className="w-full h-full object-contain" />

                {/* Hidden full-resolution canvas */}
                <canvas ref={hiddenCanvasRef} className="" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
