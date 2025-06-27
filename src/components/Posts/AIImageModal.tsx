
import React, { useState } from 'react';
import { Wand2, Loader2, ZoomIn, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: File) => void;
}

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    variants: '1',
    style: ''
  });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated images using placeholder service
    const mockImages = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop', 
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop'
    ];
    setGeneratedImages(mockImages.slice(0, parseInt(formData.variants)));
    setIsGenerating(false);
  };

  const toggleImageSelection = (image: string) => {
    setSelectedImages(prev => 
      prev.includes(image) 
        ? prev.filter(img => img !== image) 
        : [...prev, image]
    );
  };

  const handleUseSelected = () => {
    if (selectedImages.length > 0) {
      // Convert URL to File object (in real app, you'd handle this properly)
      const mockFile = new File([], 'generated-image.jpg', {
        type: 'image/jpeg'
      });
      onSelect(mockFile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            GMB Genie Image Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Input Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="image-prompt" className="text-sm font-medium mb-2 block">Image Title / Prompt</Label>
              <Textarea 
                id="image-prompt" 
                value={formData.prompt} 
                onChange={e => setFormData(prev => ({
                  ...prev,
                  prompt: e.target.value
                }))} 
                placeholder="Describe the image you want to generate..." 
                className="text-sm sm:text-base min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Number of Variants</Label>
                <Select value={formData.variants} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  variants: value
                }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Image</SelectItem>
                    <SelectItem value="2">2 Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Image Style (Optional)</Label>
                <Select value={formData.style} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  style: value
                }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="illustration">Illustration</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Images...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Images
                </>
              )}
            </Button>
          </div>

          {/* Generated Images Grid */}
          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-medium text-sm sm:text-base">Generated Images</h3>
                <Button variant="outline" size="sm" onClick={handleGenerate} className="w-full sm:w-auto">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="border rounded-lg overflow-hidden">
                      <img src={image} alt={`Generated ${index + 1}`} className="w-full h-32 sm:h-40 object-cover" />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={selectedImages.includes(image)} 
                              onCheckedChange={() => toggleImageSelection(image)} 
                            />
                            <span className="text-sm">Select</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed position */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t bg-white">
          <span className="text-sm text-gray-500 text-center sm:text-left">
            {selectedImages.length} image(s) selected
          </span>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
            <Button 
              disabled={selectedImages.length === 0} 
              onClick={handleUseSelected}
              className="w-full sm:w-auto"
            >
              Use Selected ({selectedImages.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
