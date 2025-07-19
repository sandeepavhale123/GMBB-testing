import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Clock, Edit } from "lucide-react";
import type { TransformedWorkingHour } from "../../utils/businessDataTransform";

type WorkingHour = {
  day: string;
  hours: string;
  isOpen: boolean;
};

interface EditableBusinessHoursProps {
  initialWorkingHours: TransformedWorkingHour[];
  editMode: boolean;
  onSave: (workingHours: TransformedWorkingHour[]) => void;
  onCancel: () => void;
  onEdit?: () => void;
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

function parseHours(hours: string): { open: string; close: string } {
  if (hours === "Closed") {
    return { open: "09:00", close: "18:00" };
  }

  // Handle formats like "9:00 AM - 6:00 PM" or "09:00 - 18:00"
  const parts = hours.split(" - ");
  if (parts.length !== 2) {
    return { open: "09:00", close: "18:00" };
  }

  let [openTime, closeTime] = parts.map((t) => t.trim());

  // Convert 12-hour format to 24-hour format if needed
  if (openTime.includes("AM") || openTime.includes("PM")) {
    openTime = convertTo24Hour(openTime);
  }
  if (closeTime.includes("AM") || closeTime.includes("PM")) {
    closeTime = convertTo24Hour(closeTime);
  }

  return { open: openTime, close: closeTime };
}

function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(/\s+(AM|PM)/i);
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function convertTo12Hour(time24h: string): string {
  const [hours, minutes] = time24h.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export const EditableBusinessHours: React.FC<EditableBusinessHoursProps> = ({
  initialWorkingHours,
  editMode,
  onSave,
  onCancel,
  onEdit,
}) => {
  const [hoursState, setHoursState] =
    useState<TransformedWorkingHour[]>(initialWorkingHours);

  useEffect(() => {
    setHoursState(initialWorkingHours);
  }, [initialWorkingHours, editMode]);

  const handleInputChange = (
    index: number,
    field: "open" | "close",
    value: string
  ) => {
    setHoursState((prev) => {
      const arr = [...prev];
      const currentHours = parseHours(arr[index].hours);

      const newOpen = field === "open" ? value : currentHours.open;
      const newClose = field === "close" ? value : currentHours.close;

      // Convert back to 12-hour format for display
      const displayOpen = convertTo12Hour(newOpen);
      const displayClose = convertTo12Hour(newClose);

      arr[index] = {
        ...arr[index],
        hours: `${displayOpen} - ${displayClose}`,
      };
      return arr;
    });
  };

  const handleClosedToggle = (index: number, checked: boolean) => {
    setHoursState((prev) => {
      const arr = [...prev];
      const defaultHours = defaultTimes[arr[index].day];

      arr[index] = {
        ...arr[index],
        isOpen: !checked,
        hours: checked
          ? "Closed"
          : `${convertTo12Hour(defaultHours.open)} - ${convertTo12Hour(
              defaultHours.close
            )}`,
      };
      return arr;
    });
  };

  const handleSave = () => {
    onSave(hoursState);
  };

  if (!editMode) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold">Opening Hours</CardTitle>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Hours
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hoursState.map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium w-20">{schedule.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      schedule.isOpen ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {schedule.hours}
                  </span>
                  <Badge variant={schedule.isOpen ? "default" : "secondary"}>
                    {schedule.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
            const hoursParsed = parseHours(schedule.hours);

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
                      onChange={(e) =>
                        handleClosedToggle(index, e.target.checked)
                      }
                    />
                    <span className="text-sm">Closed</span>
                  </label>
                  {schedule.isOpen && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`open-${index}`} className="text-xs">
                        Open
                      </Label>
                      <input
                        id={`open-${index}`}
                        type="time"
                        className="border rounded px-2 py-1 text-sm"
                        value={hoursParsed.open || ""}
                        onChange={(e) =>
                          handleInputChange(index, "open", e.target.value)
                        }
                        required
                      />
                      <span className="mx-1 text-gray-400">to</span>
                      <Label htmlFor={`close-${index}`} className="text-xs">
                        Close
                      </Label>
                      <input
                        id={`close-${index}`}
                        type="time"
                        className="border rounded px-2 py-1 text-sm"
                        value={hoursParsed.close || ""}
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
