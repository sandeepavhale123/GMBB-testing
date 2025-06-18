
import React, { useState } from 'react';
import { Button } from '../ui/button';

interface ReviewReplyFormProps {
  initialText: string;
  isLoading: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export const ReviewReplyForm: React.FC<ReviewReplyFormProps> = ({
  initialText,
  isLoading,
  onSave,
  onCancel
}) => {
  const [replyText, setReplyText] = useState(initialText);

  const handleSave = () => {
    onSave(replyText);
  };

  return (
    <div className="mb-4">
      <textarea 
        value={replyText} 
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply..." 
        className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        rows={3} 
      />
      <div className="flex flex-wrap gap-2 mt-3">
        <Button 
          size="sm" 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Save Reply'}
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
