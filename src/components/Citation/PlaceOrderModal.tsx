
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({ isOpen, onClose }) => {
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');

  const handleSave = () => {
    // Handle save logic here
    console.log('Button Text:', buttonText);
    console.log('Button URL:', buttonUrl);
    
    // Reset form and close modal
    setButtonText('');
    setButtonUrl('');
    onClose();
  };

  const handleCancel = () => {
    // Reset form and close modal
    setButtonText('');
    setButtonUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Enter button text"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="buttonUrl">Button URL</Label>
            <Input
              id="buttonUrl"
              type="url"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
