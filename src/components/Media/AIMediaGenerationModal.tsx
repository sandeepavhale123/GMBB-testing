import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Sparkles, Wand2, RefreshCw, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateAIImage } from '../../api/mediaApi';
import { useToast } from '../../hooks/use-toast';
import { downloadImageAsFile, generateAIImageFilename } from '../../utils/imageUtils';

interface AIMediaGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (media: { file: File; type: 'image'; prompt: string; variants: number; style: string }) => void;
}

export const AIMediaGenerationModal: React.FC<AIMediaGenerationModalProps> = ({
  isOpen,
  onClose,
  onGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [variants, setVariants] = useState(1);
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please describe the image you want to create.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await generateAIImage({
        prompt: prompt.trim(),
        variants,
        style
      });

      if (response.code === 200 && response.data.results.length > 0) {
        const imageUrls = response.data.results.map(result => result.url);
        setGeneratedImages(imageUrls);
        setSelectedImageIndex(0);
        
        toast({
          title: "Images Generated",
          description: `Successfully generated ${imageUrls.length} image${imageUrls.length > 1 ? 's' : ''}.`,
        });
      } else {
        throw new Error(response.message || 'Failed to generate images');
      }
    } catch (error) {
      console.error('AI image generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseMedia = async () => {
    if (generatedImages.length > 0 && generatedImages[selectedImageIndex]) {
      setIsDownloading(true);
      
      try {
        const imageUrl = generatedImages[selectedImageIndex];
        const filename = generateAIImageFilename(prompt, style);
        
        console.log('Converting AI image to file:', imageUrl);
        const downloadedFile = await downloadImageAsFile(imageUrl, filename);
        
        onGenerated({
          file: downloadedFile,
          type: 'image',
          prompt: prompt,
          variants: variants,
          style: style
        });
        
        toast({
          title: "Image Ready",
          description: "AI-generated image has been prepared for upload.",
        });
      } catch (error) {
        console.error('Failed to process AI image:', error);
        toast({
          title: "Processing Failed",
          description: error instanceof Error ? error.message : "Failed to process AI-generated image.",
          variant: "destructive",
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleRegenerate = () => {
    setGeneratedImages([]);
    setSelectedImageIndex(0);
    handleGenerate();
  };

  const handleClose = () => {
    setPrompt('');
    setVariants(1);
    setStyle('realistic');
    setGeneratedImages([]);
    setSelectedImageIndex(0);
    setIsGenerating(false);
    setIsDownloading(false);
    onClose();
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : generatedImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev < generatedImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Create Image with Genie
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
          {generatedImages.length === 0 ? (
            <>
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="ai-prompt" className="text-sm font-medium text-gray-900">
                  Describe the image you want to create
                </Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="e.g., A chef preparing pasta in an open kitchen with warm lighting"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[100px] text-base resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">
                  Be specific and descriptive • {prompt.length}/200 characters
                </p>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Variants Parameter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    Number of Variants
                  </Label>
                  <Select value={variants.toString()} onValueChange={(value) => setVariants(parseInt(value))}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="1">1 variant</SelectItem>
                      <SelectItem value="2">2 variants</SelectItem>
                      <SelectItem value="3">3 variants</SelectItem>
                      <SelectItem value="4">4 variants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style Parameter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    Style
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </>
          ) : (
            /* Generated Media Preview */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your AI-generated image{generatedImages.length > 1 ? 's' : ''}
                </h3>
                <p className="text-gray-600 text-sm">"{prompt}"</p>
                <p className="text-xs text-gray-500 mt-1">
                  Style: {style.charAt(0).toUpperCase() + style.slice(1)} • Generated: {generatedImages.length} variant{generatedImages.length > 1 ? 's' : ''}
                </p>
                {generatedImages.length > 1 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Viewing {selectedImageIndex + 1} of {generatedImages.length}
                  </p>
                )}
              </div>

              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={generatedImages[selectedImageIndex]} 
                  alt={prompt}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows for multiple variants */}
                {generatedImages.length > 1 && (
                  <>
                    <Button
                      onClick={handlePreviousImage}
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleNextImage}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full h-8 w-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Variant thumbnails for multiple images */}
              {generatedImages.length > 1 && (
                <div className="flex justify-center gap-2">
                  {generatedImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`Variant ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={isGenerating || isDownloading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleUseMedia}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Use This
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
