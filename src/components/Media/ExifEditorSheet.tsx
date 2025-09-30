import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, MapPin, Clock, Settings, Save } from "lucide-react";

interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  iso?: string;
  aperture?: string;
  shutterSpeed?: string;
  exposureCompensation?: string;
  captureDate?: string;
  captureTime?: string;
  gpsLatitude?: string;
  gpsLongitude?: string;
  fileSize?: string;
  dimensions?: string;
  colorSpace?: string;
}

interface ExifEditorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  exifData: ExifData;
  onSave: (data: ExifData) => void;
}

export const ExifEditorSheet: React.FC<ExifEditorSheetProps> = ({
  isOpen,
  onClose,
  exifData,
  onSave,
}) => {
  const [localData, setLocalData] = React.useState<ExifData>(exifData);

  React.useEffect(() => {
    setLocalData(exifData);
  }, [exifData]);

  const handleChange = (field: keyof ExifData, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(localData);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md overflow-y-auto bg-background border-l"
      >
        <SheetHeader className="space-y-2">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-primary" />
            Edit EXIF Metadata
          </SheetTitle>
          <SheetDescription>
            View and edit the metadata information for this image
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Camera Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Camera className="h-4 w-4 text-primary" />
              Camera Information
            </div>
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="camera" className="text-xs text-muted-foreground">
                Camera Model
              </Label>
              <Input
                id="camera"
                value={localData.camera || ""}
                onChange={(e) => handleChange("camera", e.target.value)}
                placeholder="e.g., Canon EOS R5"
                className="transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lens" className="text-xs text-muted-foreground">
                Lens
              </Label>
              <Input
                id="lens"
                value={localData.lens || ""}
                onChange={(e) => handleChange("lens", e.target.value)}
                placeholder="e.g., RF 24-70mm f/2.8"
                className="transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focalLength" className="text-xs text-muted-foreground">
                Focal Length
              </Label>
              <Input
                id="focalLength"
                value={localData.focalLength || ""}
                onChange={(e) => handleChange("focalLength", e.target.value)}
                placeholder="e.g., 50mm"
                className="transition-all duration-200"
              />
            </div>
          </div>

          {/* Exposure Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Settings className="h-4 w-4 text-primary" />
              Exposure Settings
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="iso" className="text-xs text-muted-foreground">
                  ISO
                </Label>
                <Input
                  id="iso"
                  value={localData.iso || ""}
                  onChange={(e) => handleChange("iso", e.target.value)}
                  placeholder="e.g., 100"
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aperture" className="text-xs text-muted-foreground">
                  Aperture
                </Label>
                <Input
                  id="aperture"
                  value={localData.aperture || ""}
                  onChange={(e) => handleChange("aperture", e.target.value)}
                  placeholder="e.g., f/2.8"
                  className="transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shutterSpeed" className="text-xs text-muted-foreground">
                Shutter Speed
              </Label>
              <Input
                id="shutterSpeed"
                value={localData.shutterSpeed || ""}
                onChange={(e) => handleChange("shutterSpeed", e.target.value)}
                placeholder="e.g., 1/200s"
                className="transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exposureCompensation" className="text-xs text-muted-foreground">
                Exposure Compensation
              </Label>
              <Input
                id="exposureCompensation"
                value={localData.exposureCompensation || ""}
                onChange={(e) => handleChange("exposureCompensation", e.target.value)}
                placeholder="e.g., +0.3 EV"
                className="transition-all duration-200"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Date & Time
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="captureDate" className="text-xs text-muted-foreground">
                  Capture Date
                </Label>
                <Input
                  id="captureDate"
                  type="date"
                  value={localData.captureDate || ""}
                  onChange={(e) => handleChange("captureDate", e.target.value)}
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="captureTime" className="text-xs text-muted-foreground">
                  Capture Time
                </Label>
                <Input
                  id="captureTime"
                  type="time"
                  value={localData.captureTime || ""}
                  onChange={(e) => handleChange("captureTime", e.target.value)}
                  className="transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </div>
            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="gpsLatitude" className="text-xs text-muted-foreground">
                  Latitude
                </Label>
                <Input
                  id="gpsLatitude"
                  value={localData.gpsLatitude || ""}
                  onChange={(e) => handleChange("gpsLatitude", e.target.value)}
                  placeholder="e.g., 40.7128"
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpsLongitude" className="text-xs text-muted-foreground">
                  Longitude
                </Label>
                <Input
                  id="gpsLongitude"
                  value={localData.gpsLongitude || ""}
                  onChange={(e) => handleChange("gpsLongitude", e.target.value)}
                  placeholder="e.g., -74.0060"
                  className="transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Additional Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Settings className="h-4 w-4 text-primary" />
              Additional Information
            </div>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="dimensions" className="text-xs text-muted-foreground">
                Dimensions
              </Label>
              <Input
                id="dimensions"
                value={localData.dimensions || ""}
                onChange={(e) => handleChange("dimensions", e.target.value)}
                placeholder="e.g., 4000 x 3000"
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileSize" className="text-xs text-muted-foreground">
                File Size
              </Label>
              <Input
                id="fileSize"
                value={localData.fileSize || ""}
                onChange={(e) => handleChange("fileSize", e.target.value)}
                placeholder="e.g., 2.5 MB"
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorSpace" className="text-xs text-muted-foreground">
                Color Space
              </Label>
              <Input
                id="colorSpace"
                value={localData.colorSpace || ""}
                onChange={(e) => handleChange("colorSpace", e.target.value)}
                placeholder="e.g., sRGB"
                className="transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-background border-t pt-4 pb-2 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 transition-all duration-200 hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 gap-2 transition-all duration-200"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
