
import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';

interface AIPromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  maxLength?: number;
}

export const AIPromptInput: React.FC<AIPromptInputProps> = ({
  prompt,
  onPromptChange,
  maxLength = 200
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="ai-prompt" className="text-sm font-medium text-gray-900">
        Describe the image you want to create
      </Label>
      <Textarea
        id="ai-prompt"
        placeholder="e.g., A chef preparing pasta in an open kitchen with warm lighting"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="w-full min-h-[100px] text-base resize-none"
        maxLength={maxLength}
      />
      <p className="text-xs text-gray-500">
        Be specific and descriptive • {prompt.length}/{maxLength} characters
      </p>
    </div>
  );
};
