
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, Sparkles } from 'lucide-react';
import { MediaDropzone } from './MediaDropzone';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AIMediaGenerationModal } from './AIMediaGenerationModal';
import { useListingContext } from '../../context/ListingContext';
import { uploadMedia } from '../../api/mediaApi';
import { useToast } from '../../hooks/use-toast';

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  title?: string;
  category?: string;
} 

interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
}

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (mediaItems: MediaItem[]) => void;
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [file, setFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    publishOption: 'now',
    scheduleDate: ''
  });

  const { selectedListing } = useListingContext();
  const { toast } = useToast();

  const handleFilesAdded = (newFiles: File[]) => {
    // Only take the first file to enforce single upload
    const firstFile = newFiles[0];
    if (firstFile) {
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file: firstFile,
        url: URL.createObjectURL(firstFile),
        type: firstFile.type.startsWith('image/') ? 'image' : 'video'
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
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleUpload = async () => {
    if (!file || !selectedListing) {
      toast({
        title: "Upload Error",
        description: "Please select a file and ensure a business listing is selected.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadData = {
        file: file.file,
        title: formData.title || file.file.name.replace(/\.[^/.]+$/, ""),
        category: formData.category || 'additional',
        publishOption: formData.publishOption,
        scheduleDate: formData.scheduleDate,
        listingId: selectedListing.id
      };

      const response = await uploadMedia(uploadData);
      
      if (response.code === 200) {
        // Create media item for local state update
        const mediaItem: MediaItem = {
          id: file.id,
          name: uploadData.title,
          views: '0 views',
          type: file.type,
          url: file.url,
          uploadDate: new Date().toISOString().split('T')[0]
        };

        onUpload([mediaItem]);
        setUploadComplete(true);
        
        toast({
          title: "Upload Successful",
          description: response.message,
        });
        
        // Close modal after showing success briefly
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadComplete(false);
    setFormData({
      title: '',
      category: '',
      publishOption: 'now',
      scheduleDate: ''
    });
    onClose();
  };

  const handleAIGenerated = (generatedMedia: { url: string; type: 'image' | 'video'; prompt: string }) => {
    // Convert AI generated content to a file-like object
    const aiFile: MediaFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file: new File([], 'ai-generated-media'), // Placeholder file
      url: generatedMedia.url,
      type: generatedMedia.type,
      title: generatedMedia.prompt.slice(0, 50) + '...'
    };
    
    setFile(aiFile);
    setUploadComplete(false);
    setShowAIModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Upload Media (Single Item)
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {/* Upload Complete State */}
            {uploadComplete && file && (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Upload Complete!</h3>
                <p className="text-gray-600">
                  Your <span className="font-medium text-blue-600">{file.type}</span> has been uploaded successfully.
                </p>
              </div>
            )}

            {/* Upload Interface */}
            {!uploadComplete && (
              <>
                {/* AI Generate Button */}
                <div className="flex items-end justify-end">
                  <Button
                    onClick={() => setShowAIModal(true)}
                    variant="outline"
                    className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 w-full sm:w-auto ml-auto"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate with AI
                  </Button>
                </div>

                {/* Dropzone Area - Only show if no file selected */}
                {!file && <MediaDropzone onFilesAdded={handleFilesAdded} />}

                {/* File Preview */}
                {file && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Media Preview
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Type:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {file.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <MediaPreview
                        file={file}
                        onRemove={handleFileRemove}
                      />
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <MediaForm
                  formData={formData}
                  onChange={handleFormDataChange}
                  hasFiles={!!file}
                  fileType={file?.type}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading || !selectedListing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Media'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AIMediaGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerated={handleAIGenerated}
      />
    </>
  );
};
