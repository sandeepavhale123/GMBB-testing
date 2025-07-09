import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Upload, Settings, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedFaviconUploadSectionProps {
  faviconFile: File | null;
  onFaviconChange: (file: File | null) => void;
}

export const EnhancedFaviconUploadSection: React.FC<EnhancedFaviconUploadSectionProps> = ({
  faviconFile,
  onFaviconChange,
}) => {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Favicon file must be less than 1MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG)",
        variant: "destructive",
      });
      return;
    }

    onFaviconChange(file);
    toast({
      title: "Favicon uploaded",
      description: `${file.name} ready for use`,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFavicon = () => {
    onFaviconChange(null);
    toast({
      title: "Favicon removed",
      description: "Favicon has been removed successfully",
    });
  };

  // Update favicon in real-time
  useEffect(() => {
    if (faviconFile) {
      const faviconUrl = URL.createObjectURL(faviconFile);
      
      // Remove existing favicon
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.remove();
      }
      
      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = faviconUrl;
      link.type = faviconFile.type;
      document.head.appendChild(link);
      
      return () => {
        URL.revokeObjectURL(faviconUrl);
      };
    }
  }, [faviconFile]);

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        Favicon
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div 
            className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {faviconFile ? (
              <img 
                src={URL.createObjectURL(faviconFile)} 
                alt="Favicon preview" 
                className="w-full h-full object-contain rounded p-1"
              />
            ) : (
              <Settings className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="favicon-upload" className="text-sm font-medium">
                Upload Favicon
              </Label>
              {faviconFile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={removeFavicon}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mb-3">
              PNG, JPG up to 1MB. Recommended: 32x32px or 16x16px
            </p>
            
            <input
              id="favicon-upload"
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => document.getElementById('favicon-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Favicon
            </Button>
            
            {faviconFile && (
              <div className="text-sm text-gray-600 mt-2">
                <div className="flex items-center justify-between">
                  <span className="truncate mr-2">Selected: {faviconFile.name}</span>
                  <span className="text-xs text-green-600">✓ Applied</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {dragOver && (
          <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-600">Drop favicon here to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};