import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export const ReviewLink: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [title, setTitle] = useState("How would you rate your overall experience with us?");
  const [subtitle, setSubtitle] = useState("Please click below to review your experience.");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Section */}
          <div className="bg-card rounded-lg border p-8 space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Review Link</h1>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo-upload" className="text-sm font-medium">
                Logo
              </Label>
              <div className="relative">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {logo ? (
                    <img src={logo} alt="Logo" className="h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Logo</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="Enter title..."
              />
            </div>

            {/* Subtitle Input */}
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-sm font-medium">
                Subtitle
              </Label>
              <Textarea
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="Enter subtitle..."
              />
            </div>

            {/* Next Button */}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
              Next
            </Button>
          </div>

          {/* Right Panel - Preview Section */}
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
            <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
              {/* Logo Display */}
              <div className="flex justify-center">
                {logo ? (
                  <img src={logo} alt="Logo Preview" className="h-20 object-contain" />
                ) : (
                  <div className="bg-yellow-400 px-8 py-6 rounded text-center">
                    <span className="text-lg font-bold text-black">LOGO</span>
                  </div>
                )}
              </div>

              {/* Title Display */}
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              </div>

              {/* Subtitle Display */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-8 h-8 text-orange-400"
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">Powered by My Agency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
