
import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface AIDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (description: string) => void;
}

export const AIDescriptionModal: React.FC<AIDescriptionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    variants: '3'
  });
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const variants = [
      `🎉 Exciting news! ${formData.title || 'Our latest offering'} is here! ${formData.description} Don't miss out on this amazing opportunity. Visit us today! #NewArrivals #ExcitingNews`,
      `✨ Discover ${formData.title || 'something amazing'}! ${formData.description} Perfect for anyone looking for quality and excellence. Come experience the difference! #Quality #Excellence`,
      `🚀 Ready to try ${formData.title || 'our newest addition'}? ${formData.description} Join hundreds of satisfied customers who've already made the switch! #CustomerFirst #Innovation`
    ];
    
    setGeneratedVariants(variants.slice(0, parseInt(formData.variants)));
    setIsGenerating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            AI Description Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="ai-title" className="text-sm font-medium mb-2 block">Post Title (Optional)</Label>
              <Input
                id="ai-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <Label htmlFor="ai-description" className="text-sm font-medium mb-2 block">Short Description (Optional)</Label>
              <Textarea
                id="ai-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what you want to promote..."
                rows={3}
              />
            </div>

            <div>
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

            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Descriptions
                </>
              )}
            </Button>
          </div>

          {/* Generated Variants */}
          {generatedVariants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Generated Variants</h3>
              {generatedVariants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="text-sm text-gray-700">{variant}</div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onSelect(variant)}>
                      Select
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Insert
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
