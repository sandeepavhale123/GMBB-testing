import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { X, Settings2, Camera, MapPin, Clock, Save } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { MediaDropzone } from "./MediaDropzone";
import { MediaPreview } from "./MediaPreview";
import { MediaForm } from "./MediaForm";
import { AIMediaGenerationModal } from "./AIMediaGenerationModal";
import { useListingContext } from "../../context/ListingContext";
import { useMediaContext } from "../../context/MediaContext";
import { uploadMedia, createBulkMedia } from "../../api/mediaApi";
import { useToast } from "../../hooks/use-toast";
import { MultiListingSelector } from "../Posts/CreatePostModal/MultiListingSelector";
interface MediaFile {
  id: string;
  file?: File;
  url: string;
  type: "image" | "video";
  title?: string;
  category?: string;
  selectedImage: "local" | "ai" | "gallery";
  aiImageUrl?: string;
  galleryImageUrl?: string;
}
interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: "image" | "video";
  url: string;
  uploadDate: string;
}
interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (mediaItems: MediaItem[]) => void;
  isBulkUpload?: boolean;
}
export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isBulkUpload = false
}) => {
  const [file, setFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isExifSheetOpen, setIsExifSheetOpen] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    publishOption: "now",
    scheduleDate: ""
  });
  const [exifData, setExifData] = useState({
    camera: "",
    lens: "",
    focalLength: "",
    iso: "",
    aperture: "",
    shutterSpeed: "",
    exposureCompensation: "",
    captureDate: "",
    captureTime: "",
    gpsLatitude: "",
    gpsLongitude: "",
    fileSize: "",
    dimensions: "",
    colorSpace: ""
  });
  const {
    selectedListing
  } = useListingContext();
  const {
    selectedMedia,
    clearSelection
  } = useMediaContext();
  const {
    toast
  } = useToast();

  // Helper function to detect media type from URL
  const getMediaTypeFromUrl = (url: string): 'image' | 'video' => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    return videoExtensions.includes(extension) ? 'video' : 'image';
  };

  // Effect to auto-populate with selected media from context
  React.useEffect(() => {
    if (selectedMedia && isOpen) {
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: selectedMedia.url,
        type: selectedMedia.type,
        title: selectedMedia.title,
        selectedImage: selectedMedia.source,
        aiImageUrl: selectedMedia.source === 'ai' ? selectedMedia.url : undefined,
        galleryImageUrl: selectedMedia.source === 'gallery' ? selectedMedia.url : undefined
      };
      setFile(mediaFile);
      setFormData(prev => ({
        ...prev,
        title: selectedMedia.title
      }));
    }
  }, [selectedMedia, isOpen]);
  const handleFilesAdded = (newFiles: File[]) => {
    // Only take the first file to enforce single upload
    const firstFile = newFiles[0];
    if (firstFile) {
      // console.log('File added:', firstFile.name, firstFile.size, 'bytes', firstFile.type);
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file: firstFile,
        url: URL.createObjectURL(firstFile),
        type: firstFile.type.startsWith("image/") ? "image" : "video",
        selectedImage: "local"
      };
      setFile(mediaFile);
      setUploadComplete(false);
    }
  };
  const handleFileRemove = () => {
    setFile(null);
    setUploadComplete(false);
  };
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Upload Error",
        description: "Please select a file.",
        variant: "destructive"
      });
      return;
    }
    if (isBulkUpload && selectedListings.length === 0) {
      toast({
        title: "Upload Error",
        description: "Please select at least one listing or group.",
        variant: "destructive"
      });
      return;
    }
    if (!isBulkUpload && !selectedListing) {
      toast({
        title: "Upload Error",
        description: "Please ensure a business listing is selected.",
        variant: "destructive"
      });
      return;
    }
    // console.log("Starting upload process...");
    // console.log("File details:", {
    //   selectedImage: file.selectedImage,
    //   url: file.url,
    //   aiImageUrl: file.aiImageUrl,
    //   file: file.file
    //     ? {
    //         name: file.file.name,
    //         size: file.file.size,
    //         type: file.file.type,
    //       }
    //     : null,
    // });
    setIsUploading(true);
    try {
      if (isBulkUpload) {
        // Handle bulk upload using new bulk API
        const formattedListingId = selectedListings.join(',');
        const bulkUploadData = {
          file: file.file,
          title: formData.title || file.file?.name.replace(/\.[^/.]+$/, "") || "Generated Image",
          category: formData.category || "additional",
          publishOption: formData.publishOption,
          scheduleDate: formData.scheduleDate,
          listingId: formattedListingId,
          selectedImage: file.selectedImage,
          aiImageUrl: file.aiImageUrl,
          galleryImageUrl: file.galleryImageUrl,
          galleryMediaType: (selectedMedia?.type === 'video' ? 'video' : 'photo') as "photo" | "video"
        };
        const response = await createBulkMedia(bulkUploadData);

        // Create media item for local state update
        const mediaItem: MediaItem = {
          id: file.id,
          name: formData.title || file.file?.name.replace(/\.[^/.]+$/, "") || "Generated Image",
          views: "0 views",
          type: file.type,
          url: file.url,
          uploadDate: new Date().toISOString().split("T")[0]
        };
        onUpload([mediaItem]);
        setUploadComplete(true);

        // Clear MediaContext to prevent modal reopening on page navigation
        clearSelection();
        toast({
          title: "Bulk Media Posted Successfully",
          description: `Media has been posted to ${selectedListings.length} listing${selectedListings.length > 1 ? 's' : ''}.`,
          variant: "default"
        });

        // Close modal after showing success briefly
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        // Handle single listing upload
        const uploadData = {
          file: file.file,
          title: formData.title || file.file?.name.replace(/\.[^/.]+$/, "") || "Generated Image",
          category: formData.category || "additional",
          publishOption: formData.publishOption,
          scheduleDate: formData.scheduleDate,
          listingId: selectedListing.id,
          selectedImage: file.selectedImage,
          aiImageUrl: file.aiImageUrl,
          galleryImageUrl: file.galleryImageUrl,
          galleryMediaType: (selectedMedia?.type === 'video' ? 'video' : 'photo') as "photo" | "video"
        };
        // console.log("Upload data prepared:", {
        //   fileName: uploadData.file?.name,
        //   title: uploadData.title,
        //   category: uploadData.category,
        //   publishOption: uploadData.publishOption,
        //   listingId: uploadData.listingId,
        //   selectedImage: uploadData.selectedImage,
        //   aiImageUrl: uploadData.aiImageUrl,
        // });
        const response = await uploadMedia(uploadData);
        // console.log("Upload response:", response);
        if (response.code === 200) {
          // Create media item for local state update
          const mediaItem: MediaItem = {
            id: file.id,
            name: uploadData.title,
            views: "0 views",
            type: file.type,
            url: file.url,
            uploadDate: new Date().toISOString().split("T")[0]
          };
          onUpload([mediaItem]);
          setUploadComplete(true);

          // Clear MediaContext to prevent modal reopening on page navigation
          clearSelection();
          toast({
            title: "Upload Successful",
            description: response.message
          });

          // Close modal after showing success briefly
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          throw new Error(response.message || "Upload failed");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? (error as any)?.response?.data?.message || error.message : "Failed to upload media. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleClose = () => {
    setFile(null);
    setUploadComplete(false);
    setSelectedListings([]);
    setFormData({
      title: "",
      category: "",
      publishOption: "now",
      scheduleDate: ""
    });
    onClose();
  };
  const handleAIGenerated = (generatedMedia: {
    imageUrl: string;
    prompt: string;
    variants: number;
    style: string;
  }) => {
    // console.log("AI generated media received:", {
    //   imageUrl: generatedMedia.imageUrl,
    //   prompt: generatedMedia.prompt,
    //   style: generatedMedia.style,
    //   variants: generatedMedia.variants,
    // });

    // Convert AI generated image to MediaFile
    const aiFile: MediaFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: generatedMedia.imageUrl,
      type: "image",
      title: generatedMedia.prompt.slice(0, 50) + (generatedMedia.prompt.length > 50 ? "..." : ""),
      selectedImage: "ai",
      aiImageUrl: generatedMedia.imageUrl
    };
    setFile(aiFile);
    setUploadComplete(false);
    setShowAIModal(false);

    // Pre-fill form data with AI image info
    setFormData(prev => ({
      ...prev,
      title: `AI: ${generatedMedia.prompt.slice(0, 30)}${generatedMedia.prompt.length > 30 ? "..." : ""}`,
      category: prev.category || "additional"
    }));
  };
  return <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className={`${isExifSheetOpen ? 'max-w-7xl' : 'max-w-4xl'} max-h-[90vh] overflow-hidden p-0 transition-all duration-300`}>
          <DialogDescription className="sr-only">Upload media and optionally edit EXIF metadata.</DialogDescription>
          <div className="flex h-full">
            {/* Main Content Section */}
            <div className={`${isExifSheetOpen ? 'w-1/2 border-r border-border' : 'w-full'} flex flex-col transition-all duration-300`}>
              <div className="sticky top-0 bg-background z-10 border-b border-border">
                <DialogHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {isBulkUpload ? "Upload Media to Multiple Listings" : "Upload Media"}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsExifSheetOpen(v => !v)} className="gap-2 text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary hover:scale-105">
                        <Settings2 className="h-3 w-3" />
                        {isExifSheetOpen ? "Close EXIF" : "Edit EXIF"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Upload Complete State */}
                {uploadComplete && file && <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Upload Complete!
                    </h3>
                    <p className="text-muted-foreground">
                      Your{" "}
                      <span className="font-medium text-primary">{file.type}</span>{" "}
                      has been uploaded successfully.
                    </p>
                  </div>}

                {/* Upload Interface */}
                {!uploadComplete && <>
                    {/* Multi-Listing Selector for Bulk Upload */}
                    {isBulkUpload && <div className="pb-6 border-b border-border">
                        <MultiListingSelector selectedListings={selectedListings} onListingsChange={setSelectedListings} error={selectedListings.length === 0 ? "Please select at least one listing or group." : undefined} />
                      </div>}

                    {/* Dropzone Area - Only show if no file selected */}
                    {!file && <MediaDropzone onFilesAdded={handleFilesAdded} onAIGenerate={() => setShowAIModal(true)} />}

                    {/* File Preview */}
                    {file && <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            Media Preview
                          </h3>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Type:</span>
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                {file.selectedImage === "ai" ? "AI IMAGE" : file.selectedImage === "gallery" ? "GALLERY IMAGE" : file.type.toUpperCase()}
                              </span>
                            </div>
                            {file.type === "image" && <Button variant="outline" size="sm" onClick={() => setIsExifSheetOpen(!isExifSheetOpen)} className="gap-2 text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary hover:scale-105">
                                <Settings2 className="h-3 w-3" />
                                {isExifSheetOpen ? "Close EXIF" : "Edit EXIF"}
                              </Button>}
                          </div>
                        </div>
                        <div className="max-w-xs mx-auto">
                          <MediaPreview file={file} onRemove={handleFileRemove} />
                        </div>
                      </div>}

                    {/* Form Fields */}
                    <MediaForm formData={formData} onChange={handleFormDataChange} hasFiles={!!file} fileType={file?.type} />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpload} disabled={!file || isUploading || (isBulkUpload ? selectedListings.length === 0 : !selectedListing)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                        {isUploading ? isBulkUpload ? "Uploading to Multiple Listings..." : "Uploading..." : isBulkUpload ? "Upload to Selected Listings" : "Upload Media"}
                      </Button>
                    </div>
                  </>}
              </div>
            </div>

            {/* EXIF Editor Section - Slides in from right */}
            <div className={`${isExifSheetOpen ? 'w-1/2' : 'w-0'} overflow-hidden transition-all duration-300 ease-in-out`}>
              {isExifSheetOpen && <div className="h-full bg-background animate-slide-in-right">
                  <div className="sticky top-0 bg-background z-10 border-b border-border p-6 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-bold text-foreground">Edit EXIF Metadata</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsExifSheetOpen(false)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      View and edit the metadata information for this image
                    </p>
                  </div>

                  <div className="p-6 pb-0 overflow-y-auto h-[calc(90vh-110px)]">
                    <ExifEditorContent exifData={exifData} onSave={data => {
                  setExifData({
                    camera: data.camera || "",
                    lens: data.lens || "",
                    focalLength: data.focalLength || "",
                    iso: data.iso || "",
                    aperture: data.aperture || "",
                    shutterSpeed: data.shutterSpeed || "",
                    exposureCompensation: data.exposureCompensation || "",
                    captureDate: data.captureDate || "",
                    captureTime: data.captureTime || "",
                    gpsLatitude: data.gpsLatitude || "",
                    gpsLongitude: data.gpsLongitude || "",
                    fileSize: data.fileSize || "",
                    dimensions: data.dimensions || "",
                    colorSpace: data.colorSpace || ""
                  });
                  toast({
                    title: "EXIF Data Updated",
                    description: "Metadata has been updated successfully."
                  });
                }} onClose={() => setIsExifSheetOpen(false)} />
                  </div>
                </div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AIMediaGenerationModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} onGenerated={handleAIGenerated} />
    </>;
};

// Extracted EXIF Editor Content Component
interface ExifEditorContentProps {
  exifData: any;
  onSave: (data: any) => void;
  onClose: () => void;
}
const ExifEditorContent: React.FC<ExifEditorContentProps> = ({
  exifData,
  onSave,
  onClose
}) => {
  const [localData, setLocalData] = React.useState(exifData);
  React.useEffect(() => {
    setLocalData(exifData);
  }, [exifData]);
  const handleChange = (field: string, value: string) => {
    setLocalData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = () => {
    onSave(localData);
    onClose();
  };
  return <div className="space-y-6">
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
          <Input id="camera" value={localData.camera || ""} onChange={e => handleChange("camera", e.target.value)} placeholder="e.g., Canon EOS R5" className="transition-all duration-200" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lens" className="text-xs text-muted-foreground">
            Lens
          </Label>
          <Input id="lens" value={localData.lens || ""} onChange={e => handleChange("lens", e.target.value)} placeholder="e.g., RF 24-70mm f/2.8" className="transition-all duration-200" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="focalLength" className="text-xs text-muted-foreground">
            Focal Length
          </Label>
          <Input id="focalLength" value={localData.focalLength || ""} onChange={e => handleChange("focalLength", e.target.value)} placeholder="e.g., 50mm" className="transition-all duration-200" />
        </div>
      </div>

      {/* Exposure Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Settings2 className="h-4 w-4 text-primary" />
          Exposure Settings
        </div>
        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="iso" className="text-xs text-muted-foreground">
              ISO
            </Label>
            <Input id="iso" value={localData.iso || ""} onChange={e => handleChange("iso", e.target.value)} placeholder="e.g., 100" className="transition-all duration-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aperture" className="text-xs text-muted-foreground">
              Aperture
            </Label>
            <Input id="aperture" value={localData.aperture || ""} onChange={e => handleChange("aperture", e.target.value)} placeholder="e.g., f/2.8" className="transition-all duration-200" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shutterSpeed" className="text-xs text-muted-foreground">
            Shutter Speed
          </Label>
          <Input id="shutterSpeed" value={localData.shutterSpeed || ""} onChange={e => handleChange("shutterSpeed", e.target.value)} placeholder="e.g., 1/200s" className="transition-all duration-200" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exposureCompensation" className="text-xs text-muted-foreground">
            Exposure Compensation
          </Label>
          <Input id="exposureCompensation" value={localData.exposureCompensation || ""} onChange={e => handleChange("exposureCompensation", e.target.value)} placeholder="e.g., +0.3 EV" className="transition-all duration-200" />
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
            <Input id="captureDate" type="date" value={localData.captureDate || ""} onChange={e => handleChange("captureDate", e.target.value)} className="transition-all duration-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="captureTime" className="text-xs text-muted-foreground">
              Capture Time
            </Label>
            <Input id="captureTime" type="time" value={localData.captureTime || ""} onChange={e => handleChange("captureTime", e.target.value)} className="transition-all duration-200" />
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
            <Input id="gpsLatitude" value={localData.gpsLatitude || ""} onChange={e => handleChange("gpsLatitude", e.target.value)} placeholder="e.g., 40.7128" className="transition-all duration-200" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpsLongitude" className="text-xs text-muted-foreground">
              Longitude
            </Label>
            <Input id="gpsLongitude" value={localData.gpsLongitude || ""} onChange={e => handleChange("gpsLongitude", e.target.value)} placeholder="e.g., -74.0060" className="transition-all duration-200" />
          </div>
        </div>
      </div>

      {/* Additional Metadata */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Settings2 className="h-4 w-4 text-primary" />
          Additional Information
        </div>
        <Separator />

        <div className="space-y-2">
          <Label htmlFor="dimensions" className="text-xs text-muted-foreground">
            Dimensions
          </Label>
          <Input id="dimensions" value={localData.dimensions || ""} onChange={e => handleChange("dimensions", e.target.value)} placeholder="e.g., 4000 x 3000" disabled className="bg-muted cursor-not-allowed" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileSize" className="text-xs text-muted-foreground">
            File Size
          </Label>
          <Input id="fileSize" value={localData.fileSize || ""} onChange={e => handleChange("fileSize", e.target.value)} placeholder="e.g., 2.5 MB" disabled className="bg-muted cursor-not-allowed" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="colorSpace" className="text-xs text-muted-foreground">
            Color Space
          </Label>
          <Input id="colorSpace" value={localData.colorSpace || ""} onChange={e => handleChange("colorSpace", e.target.value)} placeholder="e.g., sRGB" className="transition-all duration-200" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-background border-t border-border pt-4 pb-2 flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1 transition-all duration-200 hover:bg-accent">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1 gap-2 transition-all duration-200">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>;
};