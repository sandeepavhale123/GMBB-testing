import React from 'react';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Sparkles } from 'lucide-react';

interface AIAutoResponseToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const AIAutoResponseToggle: React.FC<AIAutoResponseToggleProps> = ({
  enabled,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <Label className="text-base font-medium text-gray-900">AI Auto Response</Label>
          <p className="text-sm text-gray-600">Let AI automatically generate and send personalized responses to reviews using advanced language models.</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} className="data-[state=checked]:bg-purple-600" />
    </div>
  );
};