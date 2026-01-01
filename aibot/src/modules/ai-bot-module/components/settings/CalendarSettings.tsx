import React, { useEffect, useState } from 'react';
import { Calendar, X, Plus, Link } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalendarSettings } from '../../hooks/useCalendarSettings';
import { CalendarSettings as CalendarSettingsType, DEFAULT_CALENDAR_SETTINGS } from '../../types';

interface CalendarSettingsProps {
  botId: string;
}

export const CalendarSettings: React.FC<CalendarSettingsProps> = ({ botId }) => {
  const { settings, isLoading, upsertSettings, isUpsertingSettings } = useCalendarSettings(botId);
  const [localSettings, setLocalSettings] = useState<CalendarSettingsType>({ ...DEFAULT_CALENDAR_SETTINGS, bot_id: botId });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = () => {
    upsertSettings(localSettings);
  };

  const updateLocalSettings = (updates: Partial<CalendarSettingsType>) => {
    setLocalSettings(prev => ({ ...prev, ...updates }));
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim().toLowerCase();
    if (keyword && !localSettings.trigger_keywords.includes(keyword)) {
      updateLocalSettings({
        trigger_keywords: [...localSettings.trigger_keywords, keyword],
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    updateLocalSettings({
      trigger_keywords: localSettings.trigger_keywords.filter(k => k !== keyword),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment / Calendar Integration
            </CardTitle>
            <CardDescription>
              Let users book appointments directly from the chat
            </CardDescription>
          </div>
          <Switch
            checked={localSettings.enabled}
            onCheckedChange={(checked) => updateLocalSettings({ enabled: checked })}
          />
        </div>
      </CardHeader>

      {localSettings.enabled && (
        <CardContent className="space-y-6">
          {/* Booking Link */}
          <div className="space-y-2">
            <Label htmlFor="booking-link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Booking Link
            </Label>
            <Input
              id="booking-link"
              value={localSettings.booking_link || ''}
              onChange={(e) => updateLocalSettings({ booking_link: e.target.value })}
              placeholder="https://calendly.com/yourname or Google Calendar booking link"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Your Calendly, Google Calendar booking page, or any scheduling link
            </p>
          </div>

          {/* Trigger Keywords */}
          <div className="space-y-2">
            <Label>Trigger Keywords</Label>
            <p className="text-xs text-muted-foreground mb-2">
              When users mention these words, the bot will suggest booking an appointment
            </p>
            
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., appointment, schedule, book, meeting"
              />
              <Button type="button" variant="secondary" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {localSettings.trigger_keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {localSettings.trigger_keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {localSettings.trigger_keywords.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No keywords added. Add keywords like "appointment", "schedule", "book", etc.
              </p>
            )}
          </div>

          {/* Booking Instruction */}
          <div className="space-y-2">
            <Label htmlFor="booking-instruction">Booking Message</Label>
            <Textarea
              id="booking-instruction"
              value={localSettings.booking_instruction || ''}
              onChange={(e) => updateLocalSettings({ booking_instruction: e.target.value })}
              placeholder="Would you like to schedule an appointment? Click the link below to book a time that works for you."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Message shown to users when a trigger keyword is detected
            </p>
          </div>

          {/* Preview */}
          {localSettings.booking_link && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="bg-background p-3 rounded border text-sm">
                <p className="mb-2">{localSettings.booking_instruction}</p>
                <a 
                  href={localSettings.booking_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  📅 Book an Appointment
                </a>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button onClick={handleSave} disabled={isUpsertingSettings}>
              {isUpsertingSettings ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
