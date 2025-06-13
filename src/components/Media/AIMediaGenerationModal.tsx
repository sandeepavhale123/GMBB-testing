
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X, Sparkles, Wand2, RefreshCw, Check } from 'lucide-react';

interface AIMediaGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (media: { url: string; type: 'image' | 'video'; prompt: string }) => void;
}

const businessTypePrompts = [
  "A chef preparing fresh ingredients in an open kitchen",
  "Customers enjoying a meal in a cozy restaurant atmosphere",
  "A beautifully plated signature dish with elegant presentation",
  "Professional team member providing excellent customer service",
  "Modern store interior showcasing featured products",
  "Happy customers using our products or services"
];

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
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
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
        type: mediaType,
        prompt: prompt
      });
    }
  };

  const handleRegenerate = () => {
    setGeneratedMedia(null);
    handleGenerate();
  };

  const handleClose = () => {
    setPrompt('');
    setMediaType('image');
    setGeneratedMedia(null);
    setIsGenerating(false);
    onClose();
  };

  const handlePromptChipClick = (chipPrompt: string) => {
    setPrompt(chipPrompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Create Media with AI
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
                  Describe the media you want to create
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

              {/* Suggested Prompts */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">
                  Suggested prompts for your business
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {businessTypePrompts.map((suggestedPrompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptChipClick(suggestedPrompt)}
                      className="text-left p-3 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors duration-200"
                    >
                      {suggestedPrompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Type Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-900">
                  Media Type
                </Label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMediaType('image')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                      mediaType === 'image'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🖼️</div>
                      <div className="font-medium">Image</div>
                      <div className="text-xs text-gray-500">High-quality photos</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMediaType('video')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                      mediaType === 'video'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎥</div>
                      <div className="font-medium">Video</div>
                      <div className="text-xs text-gray-500">Short clips</div>
                    </div>
                  </button>
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
                    Generate {mediaType}
                  </>
                )}
              </Button>
            </>
          ) : (
            /* Generated Media Preview */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your AI-generated {mediaType}
                </h3>
                <p className="text-gray-600 text-sm">"{prompt}"</p>
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
