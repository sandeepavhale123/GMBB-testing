import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const DEFAULT_SETTINGS = {
  businessName: "Your Business Name",
  keywords: "Scan to leave us a review!",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  accentColor: "#3B82F6",
  qrCodeUrl: window.location.origin + "/review-feedback",
  qrCodeSize: 200,
  showScanText: true,
};

export const QRCodePoster: React.FC = () => {
  const { t } = useTranslation();
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(DEFAULT_SETTINGS.qrCodeUrl);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_SETTINGS.backgroundColor);
  const [posterText, setPosterText] = useState(DEFAULT_SETTINGS.keywords);
  const [prominentWords, setProminentWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("Reputation.qrCodePoster.toast.logoTooLarge"));
      return;
    }

    // Validate file type
    if (!["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(file.type)) {
      toast.error(t("Reputation.qrCodePoster.toast.invalidFormat"));
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

  const handleDownload = async (format: "png" | "pdf") => {
    if (!posterRef.current) return;

    try {
      // Capture at actual display size using html-to-image
      const dataUrl = await htmlToImage.toPng(posterRef.current, {
        backgroundColor: backgroundColor,
        pixelRatio: 2,
        cacheBust: true,
      });

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `qr-poster-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        // Get the actual dimensions of the poster element
        const rect = posterRef.current.getBoundingClientRect();
        const widthInInches = rect.width / 96; // Convert px to inches (96 DPI)
        const heightInInches = rect.height / 96;
        
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [widthInInches, heightInInches],
        });
        const imgData = dataUrl;
        pdf.addImage(imgData, "PNG", 0, 0, widthInInches, heightInInches);
        pdf.save(`qr-poster-${Date.now()}.pdf`);
      }

      toast.success(t("Reputation.qrCodePoster.toast.downloadSuccess"));
    } catch (error) {
      console.error("Download error:", error);
      toast.error(t("Reputation.qrCodePoster.toast.downloadError"));
    }
  };

  const handleReset = () => {
    setLogo(null);
    setPosterText(DEFAULT_SETTINGS.keywords);
    setBackgroundColor(DEFAULT_SETTINGS.backgroundColor);
    setQrCodeUrl(DEFAULT_SETTINGS.qrCodeUrl);
    setProminentWords([]);
    setNewWord("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success(t("Reputation.qrCodePoster.toast.resetSuccess"));
  };

  const handleAddWord = () => {
    if (newWord.trim() && !prominentWords.includes(newWord.trim())) {
      setProminentWords([...prominentWords, newWord.trim()]);
      setNewWord("");
    }
  };

  const handleRemoveWord = (word: string) => {
    setProminentWords(prominentWords.filter(w => w !== word));
  };

  const BACKGROUND_COLORS = [
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#EF4444", // Red
    "#F97316", // Orange
    "#FB923C", // Light Orange
    "#84CC16", // Lime
    "#10B981", // Green
    "#06B6D4", // Cyan
    "#EAB308", // Yellow
    "#000000", // Black
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("Reputation.qrCodePoster.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("Reputation.qrCodePoster.description")}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Customization Options (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Logo & Review URL */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Add Logo & Review URL
              </h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="qrCodeUrl" className="text-sm">
                    Review URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="qrCodeUrl"
                    value={qrCodeUrl}
                    onChange={(e) => setQrCodeUrl(e.target.value)}
                    placeholder="Review URL"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm">Upload Logo</Label>
                  <div className="mt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="w-full text-sm"
                    />
                  </div>
                  {logo && (
                    <div className="relative mt-2">
                      <img
                        src={logo}
                        alt="Logo preview"
                        className="w-full h-24 object-contain border border-border rounded p-2 bg-muted"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={handleRemoveLogo}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Select Poster Color for Background */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Select Poster Color for Background
              </h3>

              <div className="space-y-2">
                <Label className="text-sm">Select color</Label>
                <div className="flex gap-2 flex-wrap">
                  {BACKGROUND_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        backgroundColor === color
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} background`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customize Poster Text */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Customize Poster Text
              </h3>

              <div>
                <Label htmlFor="posterText" className="text-sm">
                  Customize Poster Text
                </Label>
                <Input
                  id="posterText"
                  value={posterText}
                  onChange={(e) => setPosterText(e.target.value)}
                  className="mt-1"
                  maxLength={200}
                />
              </div>
            </CardContent>
          </Card>

          {/* Suggest prominent words */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Suggest prominent words
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="newWord" className="text-sm">
                      Enter Word
                    </Label>
                    <Input
                      id="newWord"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder="Enter Word"
                      className="mt-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddWord();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleAddWord}
                    className="mt-6"
                    disabled={!newWord.trim()}
                  >
                    Add word
                  </Button>
                </div>

                {prominentWords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {prominentWords.map((word) => (
                      <div
                        key={word}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{word}</span>
                        <button
                          onClick={() => handleRemoveWord(word)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button onClick={() => handleDownload("png")} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                {t("Reputation.qrCodePoster.leftPanel.actions.download")} (PNG)
              </Button>
              <Button
                onClick={() => handleDownload("pdf")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {t("Reputation.qrCodePoster.leftPanel.actions.download")} (PDF)
              </Button>
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("Reputation.qrCodePoster.leftPanel.actions.reset")}
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
                  {t("Reputation.qrCodePoster.rightPanel.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Reputation.qrCodePoster.rightPanel.subtitle")}
                </p>
              </div>

              {/* Poster Preview Container - 18x24 aspect ratio (3:4) */}
              <div className="w-full aspect-[3/4] border-2 border-border rounded-lg shadow-lg overflow-hidden">
                <div
                  ref={posterRef}
                  className="w-full h-full flex flex-col items-center justify-center p-12 space-y-8"
                  style={{
                    backgroundColor,
                  }}
                >
                  {/* Logo */}
                  {logo && (
                    <div className="w-32 h-32 flex items-center justify-center">
                      <img
                        src={logo}
                        alt="Business Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}

                  {/* QR Code */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <QRCodeSVG
                      value={qrCodeUrl}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Poster Text */}
                  {posterText && (
                    <p 
                      className="text-2xl font-semibold text-center px-4"
                      style={{ 
                        color: backgroundColor === "#000000" ? "#FFFFFF" : "#000000" 
                      }}
                    >
                      {posterText}
                    </p>
                  )}

                  {/* Prominent Words */}
                  {prominentWords.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                      {prominentWords.map((word) => (
                        <span
                          key={word}
                          className="text-lg font-bold px-4 py-2 rounded-lg"
                          style={{ 
                            backgroundColor: backgroundColor === "#000000" ? "#FFFFFF" : "#000000",
                            color: backgroundColor === "#000000" ? "#000000" : "#FFFFFF" 
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
