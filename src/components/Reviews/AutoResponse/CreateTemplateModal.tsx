
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { PersonalizationGuide } from './PersonalizationGuide';
import { TemplateForm } from './TemplateForm';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Reply Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Left Column - Personalization Guide */}
          <div className="order-2 lg:order-1">
            <PersonalizationGuide />
          </div>
          
          {/* Right Column - Template Form */}
          <div className="order-1 lg:order-2">
            <TemplateForm
              onSave={onSave}
              onCancel={onClose}
              isLoading={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
