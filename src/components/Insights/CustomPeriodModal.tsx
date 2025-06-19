
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { DateRangePicker } from '../ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface CustomPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dateRange: DateRange | undefined) => void;
  initialDateRange?: DateRange | undefined;
}

export const CustomPeriodModal: React.FC<CustomPeriodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDateRange,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(initialDateRange);

  const handleSubmit = () => {
    onSubmit(selectedDateRange);
    onClose();
  };

  const handleClose = () => {
    setSelectedDateRange(initialDateRange);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Custom Period</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <DateRangePicker
            date={selectedDateRange}
            onDateChange={setSelectedDateRange}
            placeholder="Select date range"
            className="w-full"
          />
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedDateRange?.from || !selectedDateRange?.to}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
