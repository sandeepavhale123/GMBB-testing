
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, Sparkles } from 'lucide-react';
import { MediaDropzone } from './MediaDropzone';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AIMediaGenerationModal } from './AIMediaGenerationModal';

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  title?: string;
  altText?: string;
  category?: string;
  location?: string;
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
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    altText: '',
    category: '',
    location: 'Main Location'
  });

  const handleFilesAdded = (newFiles: File[]) => {
    const mediaFiles: MediaFile[] = newFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    setFiles(prev => [...prev, ...mediaFiles]);
  };

  const handleFileRemove = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mediaItems: MediaItem[] = files.map((file) => ({
      id: file.id,
      name: formData.title || file.file.name.replace(/\.[^/.]+$/, ""),
      views: '0 views',
      type: file.type,
      url: file.url,
      uploadDate: new Date().toISOString().split('T')[0]
    }));

    onUpload(mediaItems);
    setIsUploading(false);
    handleClose();
  };

  const handleClose = () => {
    setFiles([]);
    setFormData({
      title: '',
      altText: '',
      category: '',
      location: 'Main Location'
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
      title: generatedMedia.prompt.slice(0, 50) + '...',
      altText: generatedMedia.prompt
    };
    
    setFiles(prev => [...prev, aiFile]);
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
                  Upload Media
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
            {/* Dropzone Area */}
            <MediaDropzone onFilesAdded={handleFilesAdded} />

            {/* File Previews */}
            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Media Preview ({files.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <MediaPreview
                      key={file.id}
                      file={file}
                      onRemove={() => handleFileRemove(file.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <MediaForm
              formData={formData}
              onChange={handleFormDataChange}
              hasFiles={files.length > 0}
            />

            {/* AI Generation Button */}
            <div className="border-t border-gray-200 pt-6">
              <Button
                onClick={() => setShowAIModal(true)}
                variant="outline"
                className="w-full h-12 text-base font-medium border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate with AI
              </Button>
            </div>

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
                disabled={files.length === 0 || isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isUploading ? 'Uploading...' : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
              </Button>
            </div>
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
