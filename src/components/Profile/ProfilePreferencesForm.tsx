
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TimezoneOption } from '../../services/profileService';

interface ProfilePreferencesFormProps {
  formData: {
    timezone: string;
    dashboardType: string;
  };
  timezones: TimezoneOption | null;
  onInputChange: (field: string, value: string) => void;
}

export const ProfilePreferencesForm: React.FC<ProfilePreferencesFormProps> = ({
  formData,
  timezones,
  onInputChange
}) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Preferences & Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezone */}
          <div>
            <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => onInputChange('timezone', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones && Object.entries(timezones).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dashboard Type */}
          <div>
            <Label htmlFor="dashboardType" className="text-gray-700 font-medium">Dashboard Type</Label>
            <Select value={formData.dashboardType} onValueChange={(value) => onInputChange('dashboardType', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Dashboard</SelectItem>
                <SelectItem value="advanced">Advanced Dashboard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
