
import React, { useState } from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

export const ResponseSettingsCheckboxes: React.FC = () => {
  const [settings, setSettings] = useState({
    updateNewReviews: true,
    updateOldReviews: false,
    disableAutoResponse: false,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div>
      <h3 className="text-base font-medium text-gray-900 mb-4">Response Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="updateNewReviews"
            checked={settings.updateNewReviews}
            onCheckedChange={() => handleSettingChange('updateNewReviews')}
          />
          <Label htmlFor="updateNewReviews" className="text-sm text-gray-700">
            Update for new reviews
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="updateOldReviews"
            checked={settings.updateOldReviews}
            onCheckedChange={() => handleSettingChange('updateOldReviews')}
          />
          <Label htmlFor="updateOldReviews" className="text-sm text-gray-700">
            Update for old reviews
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="disableAutoResponse"
            checked={settings.disableAutoResponse}
            onCheckedChange={() => handleSettingChange('disableAutoResponse')}
          />
          <Label htmlFor="disableAutoResponse" className="text-sm text-gray-700">
            Disable auto response
          </Label>
        </div>
      </div>
    </div>
  );
};
