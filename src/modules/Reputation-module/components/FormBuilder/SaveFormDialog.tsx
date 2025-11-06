import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface SaveFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  defaultName?: string;
  isEditMode?: boolean;
}

export const SaveFormDialog: React.FC<SaveFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  defaultName = "",
  isEditMode = false,
}) => {
  const [formName, setFormName] = useState(defaultName);

  useEffect(() => {
    if (open) {
      setFormName(defaultName);
    }
  }, [open, defaultName]);

  const handleSave = () => {
    if (formName.trim()) {
      onSave(formName.trim());
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formName.trim()) {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update" : "Save"} Survey Form
          </DialogTitle>
          <DialogDescription>
            Enter a name for your survey form template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              placeholder="Enter template name..."
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formName.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? "Update" : "Save"} Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
