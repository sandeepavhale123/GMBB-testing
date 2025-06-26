
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
  const [selectedTime, setSelectedTime] = React.useState<string>('');

  // Generate time options with AM/PM
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const displayHour = hour;
        const displayMinute = minute.toString().padStart(2, '0');
        
        // AM times
        options.push({
          value: `${hour === 12 ? 0 : hour}:${displayMinute}`,
          label: `${displayHour}:${displayMinute} AM`
        });
        
        // PM times
        options.push({
          value: `${hour === 12 ? 12 : hour + 12}:${displayMinute}`,
          label: `${displayHour}:${displayMinute} PM`
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Initialize date and time from existing schedule date
  React.useEffect(() => {
    if (formData.scheduleDate && !selectedDate) {
      try {
        const date = new Date(formData.scheduleDate);
        setSelectedDate(date);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
      } catch (error) {
        console.error('Error parsing schedule date:', error);
      }
    }
  }, [formData.scheduleDate, selectedDate]);

  const handleDateTimeChange = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours, minutes, 0, 0);
      
      const utcDateTime = convertLocalDateTimeToUTC(combinedDateTime.toISOString().slice(0, 16));
      onChange({ scheduleDate: utcDateTime });
    }
  };

  React.useEffect(() => {
    handleDateTimeChange();
  }, [selectedDate, selectedTime]);

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Time Picker */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
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
