
import React, { useState } from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

export const AIResponseSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    useReviewerName: true,
    adaptTone: true,
    referencePoints: true,
    requireApproval: false,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">AI Response Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useReviewerName"
            checked={settings.useReviewerName}
            onCheckedChange={() => handleSettingChange('useReviewerName')}
          />
          <Label htmlFor="useReviewerName" className="text-sm text-gray-700">
            Use reviewer's name in response
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="adaptTone"
            checked={settings.adaptTone}
            onCheckedChange={() => handleSettingChange('adaptTone')}
          />
          <Label htmlFor="adaptTone" className="text-sm text-gray-700">
            Adapt tone based on review sentiment
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="referencePoints"
            checked={settings.referencePoints}
            onCheckedChange={() => handleSettingChange('referencePoints')}
          />
          <Label htmlFor="referencePoints" className="text-sm text-gray-700">
            Reference specific points from review
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="requireApproval"
            checked={settings.requireApproval}
            onCheckedChange={() => handleSettingChange('requireApproval')}
          />
          <Label htmlFor="requireApproval" className="text-sm text-gray-700">
            Require approval before sending AI responses
          </Label>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        When approval is enabled, responses are saved as drafts for your review before sending.
      </p>
    </div>
  );
};
