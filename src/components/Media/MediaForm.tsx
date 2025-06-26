import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarIcon, Clock, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { convertLocalDateTimeToUTC } from '../../utils/dateUtils';
import { useProfile } from '../../hooks/useProfile';

interface MediaFormProps {
  formData: {
    title: string;
    category: string;
    publishOption: string;
    scheduleDate?: string;
  };
  onChange: (data: Partial<MediaFormProps['formData']>) => void;
  hasFiles: boolean;
  fileType?: 'image' | 'video';
}

export const MediaForm: React.FC<MediaFormProps> = ({
  formData,
  onChange,
  hasFiles,
  fileType
}) => {
  const { profileData } = useProfile();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [timeInput, setTimeInput] = React.useState<string>('');
  const [amPm, setAmPm] = React.useState<'AM' | 'PM'>('AM');

  // Initialize date and time from existing schedule date
  React.useEffect(() => {
    if (formData.scheduleDate && !selectedDate) {
      try {
        const date = new Date(formData.scheduleDate);
        setSelectedDate(date);
        
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        if (hours === 0) hours = 12;
        else if (hours > 12) hours = hours - 12;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setTimeInput(timeString);
        setAmPm(period);
      } catch (error) {
        console.error('Error parsing schedule date:', error);
      }
    }
  }, [formData.scheduleDate, selectedDate]);

  const handleDateTimeChange = () => {
    if (selectedDate && timeInput) {
      const [hours, minutes] = timeInput.split(':').map(Number);
      
      // Convert to 24-hour format
      let adjustedHours = hours;
      if (amPm === 'AM' && hours === 12) {
        adjustedHours = 0;
      } else if (amPm === 'PM' && hours !== 12) {
        adjustedHours = hours + 12;
      }
      
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(adjustedHours, minutes, 0, 0);
      
      const utcDateTime = convertLocalDateTimeToUTC(combinedDateTime.toISOString().slice(0, 16));
      onChange({ scheduleDate: utcDateTime });
    }
  };

  React.useEffect(() => {
    handleDateTimeChange();
  }, [selectedDate, timeInput, amPm]);

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validate time format (HH:MM)
    if (/^([0-1]?[0-9]):([0-5][0-9])$/.test(value) || value === '') {
      const [hours] = value.split(':').map(Number);
      if (hours >= 1 && hours <= 12) {
        setTimeInput(value);
      }
    }
  };

  const allCategories = [
    { value: 'COVER', label: 'Cover' },
    { value: 'PROFILE', label: 'Profile' },
    { value: 'LOGO', label: 'Logo' },
    { value: 'EXTERIOR', label: 'Exterior' },
    { value: 'INTERIOR', label: 'Interior' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'AT_WORK', label: 'At Work' },
    { value: 'FOOD_AND_DRINK', label: 'Food and Drink' },
    { value: 'MENU', label: 'Menu' },
    { value: 'COMMON_AREA', label: 'Common Area' },
    { value: 'ROOMS', label: 'Rooms' },
    { value: 'TEAMS', label: 'Teams' },
    { value: 'ADDITIONAL', label: 'Additional' }
  ];

  const videoCategories = [
    { value: 'EXTERIOR', label: 'Exterior' },
    { value: 'INTERIOR', label: 'Interior' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'AT_WORK', label: 'At Work' },
    { value: 'FOOD_AND_DRINK', label: 'Food and Drink' },
    { value: 'MENU', label: 'Menu' },
    { value: 'COMMON_AREA', label: 'Common Area' },
    { value: 'ROOMS', label: 'Rooms' },
    { value: 'TEAMS', label: 'Teams' },
    { value: 'ADDITIONAL', label: 'Additional' }
  ];

  const categories = fileType === 'video' ? videoCategories : allCategories;

  const publishOptions = [
    { value: 'now', label: 'Publish Now' },
    { value: 'schedule', label: 'Schedule' }
  ];

  // Get user's timezone from profile or fallback to system timezone
  const getUserTimezone = (): string => {
    if (profileData?.timezone) {
      return profileData.timezone;
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  if (!hasFiles) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Media Details</h3>
      
      {/* Title and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title or Caption
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter media title or caption..."
            value={formData.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onChange({ category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Publish Options Row */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Publish Options
          </Label>
          <Select 
            value={formData.publishOption || 'now'} 
            onValueChange={(value) => onChange({ publishOption: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose publish option" />
            </SelectTrigger>
            <SelectContent>
              {publishOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.publishOption === 'schedule' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule Date & Time
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={timeInput}
                    onChange={handleTimeInputChange}
                    placeholder="HH:MM"
                    className="flex-1"
                    step="900" // 15 minute intervals
                  />
                </div>
              </div>

              {/* AM/PM Selector */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Period</Label>
                <Select value={amPm} onValueChange={(value: 'AM' | 'PM') => setAmPm(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Globe className="w-3 h-3" />
              <span>Your timezone: {getUserTimezone()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
