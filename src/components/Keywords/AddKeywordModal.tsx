
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, X } from 'lucide-react';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKeywords: (keywords: string[]) => Promise<void>;
  onCheckRanks: (keywordIds: string[]) => Promise<void>;
}

export const AddKeywordModal: React.FC<AddKeywordModalProps> = ({
  isOpen,
  onClose,
  onAddKeywords,
  onCheckRanks
}) => {
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [keywordsList, setKeywordsList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywordsList.includes(currentKeyword.trim())) {
      setKeywordsList([...keywordsList, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddKeyword();
    }
  };

  const handleClose = () => {
    setCurrentKeyword('');
    setKeywordsList([]);
    setIsSubmitting(false);
    onClose();
  };

  const handleCheckRank = async () => {
    if (keywordsList.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onAddKeywords(keywordsList);
      // Note: In a real implementation, you'd get the keyword IDs from the response
      // and pass them to onCheckRanks
      handleClose();
    } catch (error) {
      console.error('Error adding keywords:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Keywords</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleAddKeyword}
              disabled={!currentKeyword.trim() || keywordsList.includes(currentKeyword.trim())}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {keywordsList.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Added Keywords:</p>
              <div className="flex flex-wrap gap-2">
                {keywordsList.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button 
            onClick={handleCheckRank}
            disabled={keywordsList.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Check Rank'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
