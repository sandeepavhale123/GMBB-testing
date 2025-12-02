import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfile";

interface ScheduleSectionProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  scheduledDate?: string;
  scheduledTime?: string;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ 
  enabled, 
  onEnabledChange,
  scheduledDate,
  scheduledTime,
  onDateChange,
  onTimeChange
}) => {
  const { profileData } = useProfile();
  const userTimezone = profileData?.timezone || "UTC";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>Choose when to publish</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={enabled ? "schedule" : "now"} onValueChange={(v) => onEnabledChange(v === "schedule")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="now" id="now" />
            <Label htmlFor="now">Post Now</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="schedule" id="schedule" />
            <Label htmlFor="schedule">Schedule for Later</Label>
          </div>
        </RadioGroup>

        {enabled && (
          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                type="date" 
                id="date" 
                value={scheduledDate}
                onChange={(e) => onDateChange?.(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                type="time" 
                id="time"
                value={scheduledTime}
                onChange={(e) => onTimeChange?.(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Post will be scheduled for {userTimezone} timezone
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
