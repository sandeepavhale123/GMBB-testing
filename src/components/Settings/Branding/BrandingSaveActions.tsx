import React from 'react';
import { Button } from '../../ui/button';
import { Check, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandingSaveActionsProps {
  isSaving: boolean;
  onSave: () => Promise<void>;
}

export const BrandingSaveActions: React.FC<BrandingSaveActionsProps> = ({
  isSaving,
  onSave,
}) => {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave();
      toast({
        title: "Branding updated successfully",
        description: "Your white-label branding changes have been saved",
      });
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className="px-8"
      >
        {isSaving ? (
          <>
            <Settings className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};