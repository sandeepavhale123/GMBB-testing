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
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";
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
  showScanText: true
};

// Poster actual dimensions for 18" × 24" at 300 DPI
const POSTER_WIDTH = 5400; // 18 inches × 300 DPI
const POSTER_HEIGHT = 7200; // 24 inches × 300 DPI

const COLOR_PRESETS = [{
  name: "Professional",
  bg: "#FFFFFF",
  text: "#1F2937",
  accent: "#3B82F6"
}, {
  name: "Modern",
  bg: "#F9FAFB",
  text: "#111827",
  accent: "#8B5CF6"
}, {
  name: "Vibrant",
  bg: "#FEF3C7",
  text: "#92400E",
  accent: "#F59E0B"
}, {
  name: "Minimal",
  bg: "#F3F4F6",
  text: "#374151",
  accent: "#6B7280"
}];
const QRCodePoster: React.FC = () => {
  const {
    t
  } = useTranslation("Reputation/qrCodePoster");
  const posterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [scale, setScale] = useState(1);

  // Calculate scale factor to fit poster in container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // Calculate scale to fit poster in container while maintaining aspect ratio
      const scaleX = containerWidth / POSTER_WIDTH;
      const scaleY = containerHeight / POSTER_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 100%

      setScale(newScale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);
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
    reader.onload = event => {
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
  const handleDownload = async (format: "png" | "pdf") => {
    if (!posterRef.current) return;
    
    const el = posterRef.current;

    // Create off-screen wrapper and clone
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'fixed',
      top: '0',
      left: '-100000px',
      width: `${POSTER_WIDTH}px`,
      height: `${POSTER_HEIGHT}px`,
      margin: '0',
      padding: '0',
      overflow: 'visible',
      background: backgroundColor,
      zIndex: '-1',
    });

    const clone = el.cloneNode(true) as HTMLElement;
    Object.assign(clone.style, {
      transform: 'none',
      transformOrigin: 'top left',
      width: `${POSTER_WIDTH}px`,
      height: `${POSTER_HEIGHT}px`,
      backgroundColor,
      color: textColor,
    });

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      // Wait for images in the clone
      const images = Array.from(wrapper.querySelectorAll('img')) as HTMLImageElement[];
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
                setTimeout(() => resolve(), 3000);
              })
        )
      );

      // Small delay to ensure layout is settled
      await new Promise((r) => setTimeout(r, 50));

      // Try html-to-image
      let dataUrl: string | null = null;
      try {
        dataUrl = await htmlToImage.toPng(clone, {
          backgroundColor,
          pixelRatio: 1,
          cacheBust: true,
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          style: {
            transform: 'none',
            width: `${POSTER_WIDTH}px`,
            height: `${POSTER_HEIGHT}px`,
          },
        });
      } catch (e) {
        console.warn('html-to-image failed, falling back to html2canvas', e);
        // Fallback to html2canvas
        const canvas = await html2canvas(clone, {
          backgroundColor,
          scale: 1,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          windowWidth: POSTER_WIDTH,
          windowHeight: POSTER_HEIGHT,
        });
        dataUrl = canvas.toDataURL('image/png');
      }

      if (!dataUrl) throw new Error('Failed to generate poster image');

      // Download logic
      if (format === 'png') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qr-poster-${Date.now()}.png`;
        link.click();
      } else {
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: [18, 24] });
        pdf.addImage(dataUrl, 'PNG', 0, 0, 18, 24, undefined, 'FAST');
        pdf.save(`qr-poster-${Date.now()}.pdf`);
      }
      toast.success(t('toast.downloadSuccess'));
    } catch (err) {
      console.error('Download error:', err);
      toast.error(t('toast.downloadError'));
    } finally {
      // Cleanup
      document.body.removeChild(wrapper);
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
  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
    setAccentColor(preset.accent);
  };
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("description")}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Customization Options (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t("leftPanel.logo.title")}
              </h3>

              <div className="space-y-3">
                {logo ? <div className="relative">
                    <img src={logo} alt="Logo preview" className="w-full h-32 object-contain border-2 border-border rounded-lg p-2 bg-muted" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveLogo}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div> : <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t("leftPanel.logo.dragDrop")}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      {t("leftPanel.logo.browse")}
                    </Button>
                  </div>}
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t("leftPanel.business.title")}
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="businessName">
                    {t("leftPanel.business.nameLabel")}
                  </Label>
                  <Input id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} maxLength={50} placeholder={t("leftPanel.business.namePlaceholder")} />
                </div>

                <div>
                  <Label htmlFor="keywords">
                    {t("leftPanel.business.keywordsLabel")}
                  </Label>
                  <Input id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} maxLength={100} placeholder={t("leftPanel.business.keywordsPlaceholder")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t("leftPanel.colors.title")}
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="backgroundColor">
                    {t("leftPanel.colors.background")}
                  </Label>
                  <div className="flex gap-2">
                    <Input id="backgroundColor" type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="w-20 h-10" />
                    <Input value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="textColor">
                    {t("leftPanel.colors.text")}
                  </Label>
                  <div className="flex gap-2">
                    <Input id="textColor" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-20 h-10" />
                    <Input value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">
                    {t("leftPanel.colors.accent")}
                  </Label>
                  <div className="flex gap-2">
                    <Input id="accentColor" type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-20 h-10" />
                    <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="flex-1" />
                  </div>
                </div>

                <div>
                  <Label>{t("leftPanel.colors.presets")}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {COLOR_PRESETS.map(preset => <Button key={preset.name} variant="outline" size="sm" onClick={() => applyPreset(preset)} className="justify-start">
                        <div className="flex gap-1 mr-2">
                          <div className="w-4 h-4 rounded border" style={{
                        backgroundColor: preset.bg
                      }} />
                          <div className="w-4 h-4 rounded border" style={{
                        backgroundColor: preset.accent
                      }} />
                        </div>
                        {preset.name}
                      </Button>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t("leftPanel.qrCode.title")}
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="qrCodeUrl">
                    {t("leftPanel.qrCode.urlLabel")}
                  </Label>
                  <Input id="qrCodeUrl" value={qrCodeUrl} onChange={e => setQrCodeUrl(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="qrCodeSize">
                    {t("leftPanel.qrCode.sizeLabel")}: {qrCodeSize[0] * 10}px
                  </Label>
                  <Slider id="qrCodeSize" value={qrCodeSize} onValueChange={setQrCodeSize} min={150} max={300} step={10} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showScanText">
                    {t("leftPanel.qrCode.showScanText")}
                  </Label>
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
                <h3 className="text-lg font-semibold text-foreground">
                  {t("rightPanel.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("rightPanel.subtitle")}
                </p>
              </div>

              {/* Poster Preview Container - Fixed dimensions with scale transform */}
              <div ref={containerRef} className="w-full aspect-[3/4] border-2 border-border rounded-lg shadow-lg overflow-hidden flex items-center justify-center" style={{background: backgroundColor,}}>
                <div ref={posterRef} style={{
                width: `${POSTER_WIDTH}px`,
                height: `${POSTER_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                backgroundColor,
                color: textColor
              }} className="flex flex-col items-center justify-center w-full">
                  {/* Logo - scaled to poster dimensions */}
                  {logo && <div className="mt-[600px] mb-[400px]" style={{
                  width: '960px',
                  height: '960px'
                }}>
                      <img src={logo} alt="Business Logo" className="w-full h-full object-contain" />
                    </div>}

                  {/* Business Name */}
                  <h2 className="text-[240px] font-bold text-center mb-[300px] px-[400px] leading-tight" style={{
                  color: textColor,
                }}>
                    {businessName}
                  </h2>

                  {/* QR Code */}
                  <div className="bg-white rounded-[48px] shadow-2xl mb-[300px]" style={{
                  padding: '120px'
                }}>
                    <QRCodeSVG value={qrCodeUrl} size={qrCodeSize[0] * 10} level="H" includeMargin={false} />
                  </div>

                  {/* Scan Text */}
                  {showScanText && <p className="text-[160px] font-medium text-center mb-[250px] px-[400px]" style={{
                  color: textColor
                }}>
                      {keywords}
                    </p>}

                  {/* Decorative Stars */}
                  <div className="flex gap-[120px]">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-[200px]" style={{
                    color: accentColor
                  }}>
                        ★
                      </span>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};

export default QRCodePoster;