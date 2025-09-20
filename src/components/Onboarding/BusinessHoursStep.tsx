import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BusinessHoursStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const BusinessHoursStep = ({
  formData,
  updateFormData,
  onNext,
}: BusinessHoursStepProps) => {
  const { t } = useI18nNamespace("Onboarding/businessHoursStep");
  const [hours, setHours] = useState(
    formData.hours || {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "09:00", close: "17:00", closed: true },
    }
  );

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const dayLabels = {
    monday: t("businessHoursStep.days.monday"),
    tuesday: t("businessHoursStep.days.tuesday"),
    wednesday: t("businessHoursStep.days.wednesday"),
    thursday: t("businessHoursStep.days.thursday"),
    friday: t("businessHoursStep.days.friday"),
    saturday: t("businessHoursStep.days.saturday"),
    sunday: t("businessHoursStep.days.sunday"),
  };

  const handleTimeChange = (day: string, field: string, value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleClosedChange = (day: string, closed: boolean) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed },
    }));
  };

  const handleNext = () => {
    updateFormData({ hours });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("businessHoursStep.title")}
        </h2>
        <p className="text-gray-600">{t("businessHoursStep.description")}</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
        {days.map((day) => (
          <div
            key={day}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div className="w-24">
              <Label className="text-base font-medium capitalize">
                {dayLabels[day]}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={hours[day]?.closed || false}
                onCheckedChange={(checked) =>
                  handleClosedChange(day, checked as boolean)
                }
              />
              <Label className="text-sm">
                {t("businessHoursStep.closedLabel")}
              </Label>
            </div>

            {!hours[day]?.closed && (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="time"
                  value={hours[day]?.open || "09:00"}
                  onChange={(e) =>
                    handleTimeChange(day, "open", e.target.value)
                  }
                  className="w-32"
                />
                <span className="text-gray-500">
                  {t("businessHoursStep.toLabel")}
                </span>
                <Input
                  type="time"
                  value={hours[day]?.close || "17:00"}
                  onChange={(e) =>
                    handleTimeChange(day, "close", e.target.value)
                  }
                  className="w-32"
                />
              </div>
            )}
          </div>
        ))}

        <Button onClick={handleNext} className="w-full h-12 text-base">
          {t("businessHoursStep.continueButton")}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BusinessHoursStep;
