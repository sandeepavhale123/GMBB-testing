
import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

interface AIDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (description: string) => void;
}

export const AIDescriptionModal: React.FC<AIDescriptionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    variants: '3'
  });
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const variants = [
      `🎉 Exciting news! ${formData.description} Don't miss out on this amazing opportunity. Visit us today! #NewArrivals #ExcitingNews`,
      `✨ Discover something amazing! ${formData.description} Perfect for anyone looking for quality and excellence. Come experience the difference! #Quality #Excellence`,
      `🚀 Ready to try our newest addition? ${formData.description} Join hundreds of satisfied customers who've already made the switch! #CustomerFirst #Innovation`
    ];
    
    const generatedResults = variants.slice(0, parseInt(formData.variants));
    setGeneratedVariants(generatedResults);
    if (generatedResults.length > 0) {
      setSelectedVariant(generatedResults[0]);
    }
    setIsGenerating(false);
  };

  const handleVariantSelect = (variant: string) => {
    setSelectedVariant(variant);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] sm:h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            GMB Genie Description Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 overflow-hidden">
          {/* Left Side - Input Form and Generated Variants */}
          <div className="flex flex-col space-y-4 overflow-hidden">
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg flex-shrink-0">
              <div>
                <Label htmlFor="ai-description" className="text-sm font-medium mb-2 block">Short Description (Optional)</Label>
                <Textarea
                  id="ai-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what you want to promote..."
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                <div className="flex-1 w-full">
                  <Label className="text-sm font-medium mb-2 block">Number of Variants</Label>
                  <Select value={formData.variants} onValueChange={(value) => setFormData(prev => ({ ...prev, variants: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Variant</SelectItem>
                      <SelectItem value="2">2 Variants</SelectItem>
                      <SelectItem value="3">3 Variants</SelectItem>
                      <SelectItem value="4">4 Variants</SelectItem>
                      <SelectItem value="5">5 Variants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="flex-shrink-0 w-full sm:w-auto">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Variants - Scrollable */}
            {generatedVariants.length > 0 && (
              <div className="flex-1 overflow-hidden">
                <h3 className="font-medium mb-3 text-sm sm:text-base">Generated Variants</h3>
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-2 sm:pr-4">
                    {generatedVariants.map((variant, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-lg p-3 sm:p-4 space-y-3 cursor-pointer transition-colors ${
                          selectedVariant === variant ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleVariantSelect(variant)}
                      >
                        <div className="text-sm text-gray-700 leading-relaxed">{variant}</div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(variant);
                            }}
                            className="text-xs"
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Right Side - Selected Variant Editor */}
          <div className="space-y-4">
            <div className="h-full flex flex-col">
              <Label className="text-sm font-medium mb-2 block">Edit Selected Variant</Label>
              <Textarea
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                placeholder="Select a variant from the left to edit here..."
                className="h-full min-h-[200px] sm:min-h-[300px] resize-none text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button 
            onClick={() => selectedVariant && onSelect(selectedVariant)}
            disabled={!selectedVariant}
            className="w-full sm:w-auto"
          >
            Use Selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
