
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Button } from '../../ui/button';
import { VariablesInfoCard } from './VariablesInfoCard';
import { ResponseTemplatesByRating } from './ResponseTemplatesByRating';
import { ResponseSettingsCheckboxes } from './ResponseSettingsCheckboxes';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { toggleAutoResponse } from '../../../store/slices/reviews';

export const AutoResponseTemplatesSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const dispatch = useAppDispatch();
  const { autoResponse } = useAppSelector(state => state.reviews);

  const handleToggle = () => {
    dispatch(toggleAutoResponse());
  };

  const handleSaveSettings = () => {
    // TODO: Implement save settings logic
    console.log('Saving auto response settings...');
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Auto Response Templates</h2>
              <p className="text-sm text-gray-600">
                Create custom response templates for different star ratings. Templates will be automatically sent when reviews are received.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={autoResponse.enabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-blue-600"
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="space-y-6">
            <VariablesInfoCard />
            <ResponseTemplatesByRating />
            <ResponseSettingsCheckboxes />
            
            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button 
                onClick={handleSaveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
