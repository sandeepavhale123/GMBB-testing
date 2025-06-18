
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TimezoneOption } from '../../services/profileService';

interface ProfilePreferencesFormProps {
  formData: {
    timezone: string;
    dashboardType: number;
  };
  timezones: TimezoneOption | null;
  onInputChange: (field: string, value: string) => void;
}

export const ProfilePreferencesForm: React.FC<ProfilePreferencesFormProps> = ({
  formData,
  timezones,
  onInputChange
}) => {
  const [timezoneOpen, setTimezoneOpen] = useState(false);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Preferences & Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezone with Search */}
          <div>
            <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
            <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={timezoneOpen}
                  className="mt-1 h-10 w-full justify-between"
                >
                  {formData.timezone
                    ? timezones?.[formData.timezone] || formData.timezone
                    : "Select timezone..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search timezone..." />
                  <CommandList>
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    <CommandGroup>
                      {timezones && Object.entries(timezones).map(([key, value]) => (
                        <CommandItem
                          key={key}
                          value={`${key} ${value}`}
                          onSelect={() => {
                            onInputChange('timezone', key);
                            setTimezoneOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.timezone === key ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Dashboard Type */}
          <div>
            <Label htmlFor="dashboardType" className="text-gray-700 font-medium">Dashboard Type</Label>
            <Select value={formData.dashboardType} onValueChange={(value) => onInputChange('dashboardType', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Single Listing Dashboard</SelectItem>
                <SelectItem value="1">Multi Listing Dashboard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
