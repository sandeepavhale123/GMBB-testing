
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";

type WorkingHour = {
  day: string;
  hours: string;
  isOpen: boolean;
};

interface EditableBusinessHoursProps {
  initialWorkingHours: WorkingHour[];
  editMode: boolean;
  onSave: (workingHours: WorkingHour[]) => void;
  onCancel: () => void;
}

const defaultTimes: Record<string, { open: string; close: string }> = {
  Monday: { open: "09:00", close: "18:00" },
  Tuesday: { open: "09:00", close: "18:00" },
  Wednesday: { open: "09:00", close: "18:00" },
  Thursday: { open: "09:00", close: "18:00" },
  Friday: { open: "09:00", close: "18:00" },
  Saturday: { open: "10:00", close: "16:00" },
  Sunday: { open: "09:00", close: "18:00" },
};

function parseHours(hours: string) {
  // Parses "9:00 AM - 6:00 PM" or "Closed"
  if (hours === "Closed") {
    return defaultTimes;
  }
  const [open, close] = hours.split(" - ").map((h) => h.trim());
  return { open, close };
}

export const EditableBusinessHours: React.FC<EditableBusinessHoursProps> = ({
  initialWorkingHours,
  editMode,
  onSave,
  onCancel,
}) => {
  const [hoursState, setHoursState] = useState<WorkingHour[]>(initialWorkingHours);

  useEffect(() => {
    setHoursState(initialWorkingHours);
  }, [initialWorkingHours, editMode]);

  const handleInputChange = (index: number, field: "open" | "close", value: string) => {
    setHoursState((prev) => {
      const arr = [...prev];
      const [from, to] = arr[index].hours === "Closed"
        ? [defaultTimes[arr[index].day].open, defaultTimes[arr[index].day].close]
        : arr[index].hours.split(" - ").map((h) => h.trim());
      arr[index] = {
        ...arr[index],
        hours: field === "open" ? `${value} - ${to}` : `${from} - ${value}`,
      };
      return arr;
    });
  };

  const handleClosedToggle = (index: number, checked: boolean) => {
    setHoursState((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        isOpen: !checked,
        hours: checked ? "Closed" : `${defaultTimes[arr[index].day].open} - ${defaultTimes[arr[index].day].close}`,
      };
      return arr;
    });
  };

  const handleSave = () => {
    onSave(hoursState);
  };

  if (!editMode) {
    // View only
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Opening Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hoursState.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium w-20">{schedule.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${schedule.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                    {schedule.hours}
                  </span>
                  <Badge variant={schedule.isOpen ? "default" : "secondary"}>
                    {schedule.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Edit Opening Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {hoursState.map((schedule, index) => {
            const hoursParsed =
              schedule.hours === "Closed"
                ? { open: defaultTimes[schedule.day].open, close: defaultTimes[schedule.day].close }
                : parseHours(schedule.hours);
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center justify-between gap-2 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-[120px]">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium w-20">{schedule.day}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-blue-500"
                      checked={!schedule.isOpen}
                      onChange={(e) => handleClosedToggle(index, e.target.checked)}
                    />
                    <span className="text-sm">Closed</span>
                  </label>
                  {schedule.isOpen && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`open-${index}`} className="text-xs">Open</Label>
                      <input
                        id={`open-${index}`}
                        type="time"
                        className="border rounded px-2 py-1 text-sm"
                        value={hoursParsed.open || defaultTimes[schedule.day].open}
                        onChange={(e) =>
                          handleInputChange(index, "open", e.target.value)
                        }
                        required
                      />
                      <span className="mx-1 text-gray-400">to</span>
                      <Label htmlFor={`close-${index}`} className="text-xs">Close</Label>
                      <input
                        id={`close-${index}`}
                        type="time"
                        className="border rounded px-2 py-1 text-sm"
                        value={hoursParsed.close || defaultTimes[schedule.day].close}
                        onChange={(e) =>
                          handleInputChange(index, "close", e.target.value)
                        }
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
