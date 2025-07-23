import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, X } from 'lucide-react';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddKeywords: (keywords: string[]) => void;
}

export const AddKeywordModal: React.FC<AddKeywordModalProps> = ({
  isOpen,
  onClose,
  onAddKeywords
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddKeyword = () => {
    const trimmedKeyword = keywordInput.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      setKeywords(prev => [...prev, trimmedKeyword]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(prev => prev.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleCheckRank = () => {
    if (keywords.length > 0) {
      onAddKeywords(keywords);
      setKeywords([]);
      setKeywordInput('');
      onClose();
    }
  };

  const handleClose = () => {
    setKeywords([]);
    setKeywordInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Keywords</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Keyword Input Section */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleAddKeyword}
              size="sm"
              disabled={!keywordInput.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Keywords Display */}
          {keywords.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Added Keywords:</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-gray-50">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${keyword}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Info Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">What happens next:</span> We'll check the ranking position of these keywords across different geographic locations to show you where your business appears in local search results.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button 
            onClick={handleCheckRank}
            disabled={keywords.length === 0}
          >
            Check Rank
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};