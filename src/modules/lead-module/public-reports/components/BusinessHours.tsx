import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BusinessHour {
  day: string;
  hours: string;
  isToday?: boolean;
}

interface BusinessHoursProps {
  hours: BusinessHour[];
}

export const BusinessHours: React.FC<BusinessHoursProps> = ({ hours }) => {
  const { t } = useI18nNamespace("Lead-module-public-report/businessHours");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hours.map((schedule, index) => (
              <div
                key={index}
                className={`flex justify-between items-center py-2 px-3 rounded ${
                  schedule.isToday && schedule.day !== "Tuesday"
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }`}
              >
                <span
                  className={`font-medium ${
                    schedule.isToday && schedule.day !== "Tuesday"
                      ? "text-blue-700"
                      : ""
                  }`}
                >
                  {schedule.day}
                </span>
                <span
                  className={`${
                    schedule.isToday && schedule.day !== "Tuesday"
                      ? "text-blue-700"
                      : "text-muted-foreground"
                  }`}
                >
                  {schedule.hours}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
