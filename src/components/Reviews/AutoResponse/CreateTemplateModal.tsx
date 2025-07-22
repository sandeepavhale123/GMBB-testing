
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Star, X } from 'lucide-react';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (starRating: number, content: string) => void;
  isLoading?: boolean;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(5);
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (selectedRating && content.trim()) {
      onSave(selectedRating, content.trim());
    }
  };

  const isValid = selectedRating && content.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Template
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex">
          {/* Left Panel - Green Personalization Guide */}
          <div className="w-96 bg-emerald-500 text-white p-8 flex flex-col">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Personalize</h2>
              <h3 className="text-xl font-semibold mb-6">Your Reply Templates</h3>
              
              <p className="text-sm opacity-90 mb-6 leading-relaxed">
                You can use the following variables while creating your templates to make your responses more dynamic and personalized:
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="text-sm">
                  <span className="font-semibold">{"{full_name}"}</span> – Displays the reviewer's full name.
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{"{first_name}"}</span> – Displays the reviewer's first name.
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{"{last_name}"}</span> – Displays the reviewer's last name.
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{"{owner_name}"}</span> – Displays your (business owner's) name.
                </div>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Form */}
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select rating
                </label>
                <Select 
                  value={selectedRating?.toString()} 
                  onValueChange={(value) => setSelectedRating(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                className={`w-3 h-3 ${
                                  index < rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Textarea
                  placeholder="Enter your template message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Close
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!isValid || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
