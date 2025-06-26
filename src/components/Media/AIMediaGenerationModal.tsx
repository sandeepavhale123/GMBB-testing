
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Sparkles, Wand2, RefreshCw, Check } from 'lucide-react';

interface AIMediaGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (media: { url: string; type: 'image'; prompt: string; variants: number; style: string }) => void;
}

const sampleGeneratedImages = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"
];

export const AIMediaGenerationModal: React.FC<AIMediaGenerationModalProps> = ({
  isOpen,
  onClose,
  onGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [variants, setVariants] = useState(1);
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Use a sample image for demo
    const randomImage = sampleGeneratedImages[Math.floor(Math.random() * sampleGeneratedImages.length)];
    setGeneratedMedia(randomImage);
    setIsGenerating(false);
  };

  const handleUseMedia = () => {
    if (generatedMedia) {
      onGenerated({
        url: generatedMedia,
        type: 'image',
        prompt: prompt,
        variants: variants,
        style: style
      });
    }
  };

  const handleRegenerate = () => {
    setGeneratedMedia(null);
    handleGenerate();
  };

  const handleClose = () => {
    setPrompt('');
    setVariants(1);
    setStyle('realistic');
    setGeneratedMedia(null);
    setIsGenerating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Create Image with AI
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
          {!generatedMedia ? (
            <>
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="ai-prompt" className="text-sm font-medium text-gray-900">
                  Describe the image you want to create
                </Label>
                <Input
                  id="ai-prompt"
                  type="text"
                  placeholder="e.g., A chef preparing pasta in an open kitchen with warm lighting"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-12 text-base"
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
                  Your AI-generated image
                </h3>
                <p className="text-gray-600 text-sm">"{prompt}"</p>
                <p className="text-xs text-gray-500 mt-1">
                  Style: {style.charAt(0).toUpperCase() + style.slice(1)} • Variants: {variants}
                </p>
              </div>

              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={generatedMedia} 
                  alt={prompt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleUseMedia}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Use This
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
