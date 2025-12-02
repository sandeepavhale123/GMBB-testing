import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";

interface ScheduleOptionsCardProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  scheduledDate?: string;
  scheduledTime?: string;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
}

export const ScheduleOptionsCard: React.FC<ScheduleOptionsCardProps> = ({
  enabled,
  onEnabledChange,
  scheduledDate,
  scheduledTime,
  onDateChange,
  onTimeChange,
}) => {
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Schedule Options</CardTitle>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date</Label>
              <Input
                type="date"
                id="schedule-date"
                value={scheduledDate}
                onChange={(e) => onDateChange?.(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input
                type="time"
                id="schedule-time"
                value={scheduledTime}
                onChange={(e) => onTimeChange?.(e.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Post will be scheduled for {userTimezone} timezone</p>
        </CardContent>
      )}
    </Card>
  );
};
