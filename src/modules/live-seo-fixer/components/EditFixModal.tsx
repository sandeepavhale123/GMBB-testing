import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wand2 } from 'lucide-react';
import AIContentModal from './AIContentModal';

interface EditFixModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageUrl: string;
  pageType: string;
  targetKeyword: string;
  projectName: string;
  originalValue: string;
  suggestedFix: string;
  contentType: 'title' | 'meta-description' | 'alt-tags' | 'schema' | 'h1';
  onSave: (newValue: string) => void;
  optimalMin?: number;
  optimalMax?: number;
  recommendedDescription?: string;
}

 const EditFixModal: React.FC<EditFixModalProps> = ({
  open,
  onOpenChange,
  pageUrl,
  pageType,
  targetKeyword,
  projectName,
  originalValue,
  suggestedFix,
  contentType,
  onSave,
  optimalMin,
  optimalMax,
  recommendedDescription,
}) => {
  const [editedValue, setEditedValue] = React.useState(suggestedFix || '');

  React.useEffect(() => {
    setEditedValue(suggestedFix || '');
  }, [suggestedFix, open]);

  const handleSave = () => {
    onSave(editedValue);
    onOpenChange(false);
  };

  const handleAIContentGenerated = (content: string) => {
    setEditedValue(content);
  };

  const getCharacterLimit = () => {
    // Use value_stats if available, otherwise fall back to defaults
    if (optimalMin && optimalMax) {
      return { min: optimalMin, max: optimalMax };
    }
    
    switch (contentType) {
      case 'title':
        return { min: 50, max: 60 };
      case 'meta-description':
        return { min: 120, max: 160 };
      default:
        return null;
    }
  };

  const characterLimit = getCharacterLimit();
  const currentLength = editedValue.length;
  
  const getCharacterStatus = () => {
    if (!characterLimit) return null;
    
    if (currentLength < characterLimit.min) {
      return { color: 'text-orange-600', message: 'Too short - add more characters' };
    } else if (currentLength > characterLimit.max) {
      return { color: 'text-red-600', message: 'Too long - reduce characters' };
    } else {
      return { color: 'text-green-600', message: 'Optimal length' };
    }
  };
  
  const characterStatus = getCharacterStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit SEO Fix</DialogTitle>
          <DialogDescription>
            Review and modify the suggested fix for this page
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Page Details */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Page URL</Label>
            <div className="text-sm text-blue-600 break-all">{pageUrl}</div>
          </div>

          {/* Context Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Page Type: {pageType}</Badge>
            <Badge variant="outline">Keyword: {targetKeyword}</Badge>
          </div>

          {/* Recommended Range Info */}
          {characterLimit && recommendedDescription && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="text-sm text-blue-900">
                <strong>SEO Recommendation:</strong> {recommendedDescription}
              </div>
            </div>
          )}

          {/* Original Value */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Original Value</Label>
            <div className="bg-muted p-3 rounded-md text-sm">
              {originalValue || <span className="text-muted-foreground">No original value</span>}
            </div>
            {originalValue && characterLimit && (
              <div className="text-xs text-muted-foreground">
                Length: {originalValue.length} characters
                {originalValue.length < characterLimit.min && ` (${characterLimit.min - originalValue.length} below optimal)`}
                {originalValue.length > characterLimit.max && ` (${originalValue.length - characterLimit.max} above optimal)`}
              </div>
            )}
          </div>

          {/* Suggested Fix with AI Help */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Suggested Fix</Label>
              <AIContentModal
                projectName={projectName}
                pageUrl={pageUrl}
                pageType={pageType}
                targetKeyword={targetKeyword}
                contentType={contentType}
                currentContent={originalValue}
                onContentGenerated={handleAIContentGenerated}
                trigger={
                  <Button variant="outline" size="sm">
                    <Wand2 size={16} className="mr-2" />
                    AI Help
                  </Button>
                }
              />
            </div>
            <Textarea
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="min-h-[100px]"
              placeholder="Enter suggested fix..."
            />
            {characterLimit && (
              <div className="flex items-center justify-between text-xs">
                <span className={characterStatus?.color}>
                  {currentLength} characters • {characterStatus?.message}
                </span>
                <span className="text-muted-foreground">
                  Optimal: {characterLimit.min}-{characterLimit.max}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFixModal;