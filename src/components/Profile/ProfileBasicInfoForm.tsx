import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ProfileBasicInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    language: string;
  };
  onInputChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string;
  hasFieldError: (field: string) => boolean;
}

export const ProfileBasicInfoForm: React.FC<ProfileBasicInfoFormProps> = ({
  formData,
  onInputChange,
  getFieldError,
  hasFieldError,
}) => {
  // use our hook to auto-load the namespace and get safe t()
  const { t } = useI18nNamespace("Profile/profileBasicInfoForm");
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          {t("editProfileTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              {t("firstName")}
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              className={`mt-1 h-10 ${
                hasFieldError("firstName") ? "border-red-500" : ""
              }`}
            />
            {hasFieldError("firstName") && (
              <p className="text-sm text-red-500 mt-1">
                {getFieldError("firstName")}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              {t("lastName")}
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              className={`mt-1 h-10 ${
                hasFieldError("lastName") ? "border-red-500" : ""
              }`}
            />
            {hasFieldError("lastName") && (
              <p className="text-sm text-red-500 mt-1">
                {getFieldError("lastName")}
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">
            {t("email")}
          </Label>
          <Input
            id="email_s"
            type="email"
            value={formData.email}
            className={`mt-1 h-10 ${
              hasFieldError("email") ? "border-red-500" : ""
            }`}
            disabled={true}
          />
          {hasFieldError("email") && (
            <p className="text-sm text-red-500 mt-1">
              {getFieldError("email")}
            </p>
          )}
          <Input
            id="email"
            type="hidden"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className={`mt-1 h-10 ${
              hasFieldError("email") ? "border-red-500" : ""
            }`}
          />
          {hasFieldError("email") && (
            <p className="text-sm text-red-500 mt-1">
              {getFieldError("email")}
            </p>
          )}
        </div>

        {/* Language Field */}
        <div>
          <Label htmlFor="language" className="text-gray-700 font-medium">
            {t("language")}
          </Label>
          <Select
            value={formData.language}
            onValueChange={(value) => onInputChange("language", value)}
          >
            <SelectTrigger className="mt-1 h-10">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
