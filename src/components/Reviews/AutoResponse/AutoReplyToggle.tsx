import React from "react";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Settings } from "lucide-react";
interface AutoReplyToggleProps {
  enabled: boolean;
  onToggle: () => void;
}
export const AutoReplyToggle: React.FC<AutoReplyToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <Label className="text-base font-medium text-gray-900">
            Auto Response Templates
          </Label>
          <p className="text-sm text-gray-600">
            Create custom response templates for different star ratings.
            Templates will be automatically sent when reviews are received.
          </p>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  );
};
