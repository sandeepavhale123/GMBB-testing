import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { X, Settings2, Camera, MapPin, Clock, Save } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { MediaDropzone } from "./MediaDropzone";
import { MediaPreview } from "./MediaPreview";
import { MediaForm } from "./MediaForm";
import { AIMediaGenerationModal } from "./AIMediaGenerationModal";
import { useListingContext } from "../../context/ListingContext";
import { useMediaContext } from "../../context/MediaContext";
import { uploadMedia, createBulkMedia, getExifTemplateList, getExifTemplateDetails, updateImgexifDetails, ExifTemplate } from "../../api/mediaApi";
import { useToast } from "../../hooks/use-toast";
import { MultiListingSelector } from "../Posts/CreatePostModal/MultiListingSelector";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
    name: "",
    subject: "",
    copyright: "",
    title: "",
    keyword: "",
    author: "",
    comment: "",
    description: "",
    gpsLatitude: "",
    gpsLongitude: "",
    maker: "",
    software: "",
    model: "",
    template: "default"
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
        <DialogContent className={`${isExifSheetOpen ? 'max-w-7xl' : 'max-w-4xl'} max-h-[90vh] p-0 transition-all duration-300 flex flex-col rounded-lg overflow-hidden`}>
          <DialogDescription className="sr-only">Upload media and optionally edit EXIF metadata.</DialogDescription>
          <div className="flex h-full overflow-hidden">
            {/* Main Content Section - Hidden on mobile/tablet when EXIF is open */}
            <div className={`${isExifSheetOpen ? 'hidden lg:flex lg:w-1/2 lg:border-r lg:border-border' : 'w-full'} flex flex-col transition-all duration-300`}>
              <div className="sticky top-0 bg-background z-10 border-b border-border">
                <DialogHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {isBulkUpload ? "Upload Media to Multiple Listings" : "Upload Media"}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      {/* <Button variant="outline" size="sm" onClick={() => setIsExifSheetOpen(v => !v)} className="gap-2 text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary hover:scale-105">
                        <Settings2 className="h-3 w-3" />
                        {isExifSheetOpen ? "Close EXIF" : "Edit EXIF"}
                       </Button> */}
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

            {/* EXIF Editor Section - Full width on mobile/tablet, half width on desktop */}
            <div className={`${isExifSheetOpen ? 'w-full lg:w-1/2' : 'w-0'} overflow-hidden transition-all duration-300 ease-in-out`}>
              {isExifSheetOpen && <div className="h-full bg-background flex flex-col animate-slide-in-right">
                  <div className="sticky top-0 bg-background z-10 border-b border-border p-6 pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h3 className="text-2xl font-bold text-foreground">Edit EXIF Metadata</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsExifSheetOpen(false)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 overflow-y-auto flex-1">
                    <ExifEditorContent exifData={exifData} imageUrl={file?.url} onSave={data => {
                  setExifData(data);
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
  imageUrl?: string;
  onSave: (data: any) => void;
  onClose: () => void;
}
const ExifEditorContent: React.FC<ExifEditorContentProps> = ({
  exifData,
  imageUrl,
  onSave,
  onClose
}) => {
  const { toast } = useToast();
  const [localData, setLocalData] = React.useState(exifData);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [templates, setTemplates] = React.useState<ExifTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState("");
  const [isLoadingTemplates, setIsLoadingTemplates] = React.useState(false);
  const [isLoadingTemplateDetails, setIsLoadingTemplateDetails] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [newTemplateName, setNewTemplateName] = React.useState("");
  
  React.useEffect(() => {
    setLocalData(exifData);
  }, [exifData]);

  // Load template list on mount
  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await getExifTemplateList({
        search: "",
        page: 1,
        limit: 100,
      });
      if (response.code === 200) {
        setTemplates(response.data.templates);
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error({
        title: "Failed to load templates",
        description: "Could not fetch EXIF templates. Please try again.",
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    if (!templateId || templateId === "none") {
      return;
    }

    setIsLoadingTemplateDetails(true);
    try {
      const response = await getExifTemplateDetails({ templateId });
      if (response.code === 200) {
        const template = response.data.template;
        setLocalData({
          name: template.imgname || "",
          title: template.imgtitle || "",
          subject: template.imgsub || "",
          keyword: template.imgkey || "",
          copyright: template.imgcopy || "",
          author: template.imgauthor || "",
          comment: template.imgcomment || "",
          description: template.imgdesc || "",
          gpsLatitude: template.imglat || "",
          gpsLongitude: template.imglong || "",
          maker: template.imgmaker || "",
          software: template.imgsoftware || "",
          model: template.imgmodel || "",
        });
        toast.success({
          title: "Template loaded",
          description: `"${template.tempname}" has been applied to all fields.`,
        });
      }
    } catch (error) {
      console.error("Error loading template details:", error);
      toast.error({
        title: "Failed to load template",
        description: "Could not fetch template details. Please try again.",
      });
    } finally {
      setIsLoadingTemplateDetails(false);
    }
  };
  const handleChange = (field: string, value: string) => {
    setLocalData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // If no template selected, show confirmation dialog
    if (!selectedTemplate || selectedTemplate === "none") {
      setShowSaveDialog(true);
      return;
    }

    // Template selected, save with saveAs: 0
    await performSave(0, "");
  };

  const performSave = async (saveAs: 0 | 1, tempname: string) => {
    if (!imageUrl) {
      toast.error({
        title: "Error",
        description: "Image URL is required to update EXIF data.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateImgexifDetails({
        ImageUrl: imageUrl,
        imgname: localData.name || "",
        imgtitle: localData.title || "",
        imgsub: localData.subject || "",
        imgkey: localData.keyword || "",
        imgcopy: localData.copyright || "",
        imgauthor: localData.author || "",
        imgcomment: localData.comment || "",
        imgdesc: localData.description || "",
        imglat: localData.gpsLatitude || "",
        imglong: localData.gpsLongitude || "",
        imgmaker: localData.maker || "",
        imgsoftware: localData.software || "",
        imgmodel: localData.model || "",
        saveAs,
        tempname,
      });

      if (response.code === 200) {
        toast.success({
          title: "EXIF data updated",
          description: saveAs === 1 ? `Template "${tempname}" saved successfully.` : "Metadata updated successfully.",
        });
        onSave(localData);
        
        // Reload templates if a new one was saved
        if (saveAs === 1) {
          await loadTemplates();
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Error updating EXIF data:", error);
      toast.error({
        title: "Failed to update EXIF data",
        description: "Could not save metadata. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setShowSaveDialog(false);
      setNewTemplateName("");
    }
  };

  const handleSaveAsNewTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast.warning({
        title: "Template name required",
        description: "Please enter a name for the template.",
      });
      return;
    }
    await performSave(1, newTemplateName.trim());
  };
  return <div className="space-y-6">
      {/* Row 1: Image Preview + Template Selector */}
      <div className="flex items-start gap-4">
        {imageUrl && <div className="flex-shrink-0">
            <img src={imageUrl} alt="Preview" className="w-[100px] h-[100px] object-cover rounded-lg border border-border" />
          </div>}
        <div className="flex-1 space-y-2 px-3 pb-3 bg-blue-100 rounded-lg pt-2 ">
          <Label htmlFor="template" className="text-sm font-medium text-foreground">
            Select Template
          </Label>
          <Select 
            value={selectedTemplate} 
            onValueChange={handleTemplateSelect}
            disabled={isLoadingTemplates || isLoadingTemplateDetails}
          >
            <SelectTrigger id="template">
              <SelectValue placeholder={isLoadingTemplates ? "Loading templates..." : "Select a template"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.template_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Image Metadata Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Image Metadata</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-muted-foreground">Name</Label>
            <Input id="name" value={localData.name || ""} onChange={e => handleChange("name", e.target.value)} placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-xs text-muted-foreground">Subject</Label>
            <Input id="subject" value={localData.subject || ""} onChange={e => handleChange("subject", e.target.value)} placeholder="Enter subject" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright" className="text-xs text-muted-foreground">Copyright</Label>
            <Input id="copyright" value={localData.copyright || ""} onChange={e => handleChange("copyright", e.target.value)} placeholder="Enter copyright" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs text-muted-foreground">Title</Label>
            <Input id="title" value={localData.title || ""} onChange={e => handleChange("title", e.target.value)} placeholder="Enter title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyword" className="text-xs text-muted-foreground">Keyword</Label>
            <Input id="keyword" value={localData.keyword || ""} onChange={e => handleChange("keyword", e.target.value)} placeholder="Enter keywords" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground">Author</Label>
            <Input id="author" value={localData.author || ""} onChange={e => handleChange("author", e.target.value)} placeholder="Enter author" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-xs text-muted-foreground">Comment</Label>
            <Input id="comment" value={localData.comment || ""} onChange={e => handleChange("comment", e.target.value)} placeholder="Enter comment" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs text-muted-foreground">Description</Label>
            <Input id="description" value={localData.description || ""} onChange={e => handleChange("description", e.target.value)} placeholder="Enter description" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Advanced Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Advanced</h3>
          </div>
          <Switch
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
          />
        </div>
        
        {showAdvanced && (
          <div className="space-y-4 animate-fade-in">
            {/* GPS Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <Label className="text-xs font-medium text-muted-foreground">GPS Info</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpsLatitude" className="text-xs text-muted-foreground">Latitude</Label>
                  <Input id="gpsLatitude" value={localData.gpsLatitude || ""} onChange={e => handleChange("gpsLatitude", e.target.value)} placeholder="e.g., 40.7128" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpsLongitude" className="text-xs text-muted-foreground">Longitude</Label>
                  <Input id="gpsLongitude" value={localData.gpsLongitude || ""} onChange={e => handleChange("gpsLongitude", e.target.value)} placeholder="e.g., -74.0060" />
                </div>
              </div>
            </div>

            {/* Camera & Software Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maker" className="text-xs text-muted-foreground">Maker</Label>
                <Input id="maker" value={localData.maker || ""} onChange={e => handleChange("maker", e.target.value)} placeholder="e.g., Canon" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="software" className="text-xs text-muted-foreground">Software</Label>
                <Input id="software" value={localData.software || ""} onChange={e => handleChange("software", e.target.value)} placeholder="e.g., Adobe Photoshop" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="model" className="text-xs text-muted-foreground">Model</Label>
                <Input id="model" value={localData.model || ""} onChange={e => handleChange("model", e.target.value)} placeholder="e.g., EOS R5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className=" bg-background border-t border-border pt-4  flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose} disabled={isSaving} className="1">
          Close
        </Button>
        <Button onClick={handleSave} disabled={isSaving || isLoadingTemplateDetails} className=" gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Save Template Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Save as Template?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to save this EXIF data as a template for future use?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="templateName" className="text-sm font-medium">
              Template Name
            </Label>
            <Input
              id="templateName"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => performSave(0, "")}
              disabled={isSaving}
            >
              No, Just Save
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSaveAsNewTemplate}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Yes, Save Template"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};