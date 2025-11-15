import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useProfile } from "../../hooks/useProfile";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TimezoneOption } from "../../services/profileService";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ProfilePreferencesFormProps {
  formData: {
    timezone: string;
    dashboardType: string;
  };
  timezones: TimezoneOption | null;
  userRole?: string;
  onInputChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string;
  hasFieldError: (field: string) => boolean;
}

export const ProfilePreferencesForm: React.FC<ProfilePreferencesFormProps> = ({
  formData,
  timezones,
  userRole,
  onInputChange,
}) => {
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const { profileData } = useProfile();

  const isAdmin = userRole === "admin";
  const currentDashboardType =
    profileData?.dashboardType || parseInt(formData.dashboardType);
  const shouldShowDashboardType =
    isAdmin && (currentDashboardType === 0 || currentDashboardType === 1);

  // ✅ load both "profile" namespaces
  const { t } = useI18nNamespace("Profile/profilePreferencesForm");

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          {t("preferencesTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`grid grid-cols-1 gap-4 ${
            shouldShowDashboardType ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          {/* Timezone with Search */}
          <div>
            <Label htmlFor="timezone" className="text-gray-700 font-medium">
              {t("timezone")}
            </Label>
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
                    : t("labels.selectTimezone")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("labels.searchTimezone")} />
                  <CommandList>
                    <CommandEmpty>{t("labels.noTimezoneFound")}</CommandEmpty>
                    <CommandGroup>
                      {timezones &&
                        Object.entries(timezones).map(([key, value]) => (
                          <CommandItem
                            key={key}
                            value={`${key} ${value}`}
                            onSelect={() => {
                              onInputChange("timezone", key);
                              setTimezoneOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.timezone === key
                                  ? "opacity-100"
                                  : "opacity-0"
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

          {/* Dashboard Type - Only show for admin users with dashboard type 0 or 1 */}
          {shouldShowDashboardType && (
            <div>
              <Label
                htmlFor="dashboardType"
                className="text-gray-700 font-medium"
              >
                {t("labels.dashboardType")}
              </Label>
              <Select
                value={formData.dashboardType}
                onValueChange={(value) => onInputChange("dashboardType", value)}
              >
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Single Listing Dashboard</SelectItem>
                  <SelectItem value="1">Multi Listing Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
