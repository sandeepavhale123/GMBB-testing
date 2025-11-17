import React, { useState } from "react";
import { Upload, Eye, EyeOff, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTeam } from "../../hooks/useTeam";
import { toast } from "../../hooks/use-toast";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";
interface AddTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { t } = useI18nNamespace([
    "Settings/addTeamMemberModal",
    "Validation/validation",
  ]);

  const nameSchema = z
    .string()
    .min(2, t("name.minLength"))
    .regex(/^[A-Za-z\s]+$/, t("name.lettersOnly"))
    .refine(
      (val) => (val.match(/[A-Za-z]/g) || []).length >= 3,
      t("name.minAlphabetic")
    );

  const addTeamMemberSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: z
      .string()
      .trim()
      .min(1, t("email.required"))
      .email(t("email.invalid")),
    password: z
      .string()
      .trim()
      .min(8, t("password.minLength"))
      .regex(/[A-Z]/, t("password.uppercase"))
      .regex(/[a-z]/, t("password.lowercase"))
      .regex(/[0-9]/, t("password.number"))
      .regex(/[^A-Za-z0-9]/, t("password.specialChar")),
    role: z.string().min(1, t("team.roleRequired")),
    profilePicture: z.string().optional(),
  });
  type AddTeamMemberFormData = z.infer<typeof addTeamMemberSchema>;
  const { addTeamMember, isAdding, addError, clearTeamAddError } = useTeam();
  const [formData, setFormData] = useState<AddTeamMemberFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    profilePicture: "",
  });

  const {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
  } = useFormValidation(addTeamMemberSchema);

  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");

  const handleInputChange = (
    field: keyof AddTeamMemberFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (hasFieldError(field)) clearFieldError(field);
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePreview(result);
        setFormData((prev) => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      profilePicture: "",
    });
    setProfilePreview("");
    setShowPassword(false);
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // // Basic validation
    // if (
    //   !formData.firstName.trim() ||
    //   !formData.lastName.trim() ||
    //   !formData.email.trim() ||
    //   !formData.password.trim() ||
    //   !formData.role
    // ) {
    //   toast({
    //     title: "Validation Error",
    //     description: "Please fill in all required fields.",
    //     variant: "error",
    //   });
    //   return;
    // }

    // // Email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(formData.email)) {
    //   toast({
    //     title: "Invalid Email",
    //     description: "Please enter a valid email address.",
    //     variant: "error",
    //   });
    //   return;
    // }
    const result = validate(formData);
    if (!result.isValid) {
      toast({
        title: t("addTeamMemberModal.messages.validationError.title"),
        description: t(
          "addTeamMemberModal.messages.validationError.description"
        ),
        variant: "error",
      });
      return;
    }

    try {
      // Map form data to API request format
      const requestData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.email.trim(), // Email field maps to username in API
        password: formData.password,
        role: formData.role.toLowerCase(), // Ensure role is lowercase for API
      };

      const result = await addTeamMember(requestData);

      // Handle successful addition
      if (result.meta.requestStatus === "fulfilled") {
        toast({
          title: t("addTeamMemberModal.messages.success.title"),
          description: t("addTeamMemberModal.messages.success.description", {
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
          variant: "success",
        });

        resetForm();
        onOpenChange(false);
        onSuccess?.();
      }
      // Handle rejected state (API returned error)
      else if (result.meta.requestStatus === "rejected") {
        // Extract error message from Redux rejected action
        const apiErrorMessage =
          (result.payload as any)?.message || // For structured API errors from rejectWithValue
          t("addTeamMemberModal.messages.error.default");

        toast({
          title: t("addTeamMemberModal.messages.error.title"),
          description: apiErrorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Fallback catch for any unexpected errors
      console.error("Unexpected error in add team member:", error);

      const apiErrorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t("addTeamMemberModal.messages.error.default");

      toast({
        title: t("addTeamMemberModal.messages.error.title"),
        description: apiErrorMessage,
        variant: "destructive",
      });
    }
  };

  // Clear add error when modal opens
  React.useEffect(() => {
    if (open && addError) {
      clearTeamAddError();
    }
  }, [open, addError, clearTeamAddError]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addTeamMemberModal.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-2 hidden">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profilePreview} alt="user-profile" />
              <AvatarFallback className="bg-gray-100 text-gray-400">
                <Upload className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
              />
              <Label htmlFor="profile-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>{t("addTeamMemberModal.profile.uploadPhoto")}</span>
                </Button>
              </Label>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("addTeamMemberModal.fields.firstName.label")}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder={t(
                  "addTeamMemberModal.fields.firstName.placeholder"
                )}
              />
              {hasFieldError("firstName") && (
                <p className="text-sm text-red-500">
                  {getFieldError("firstName")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {" "}
                {t("addTeamMemberModal.fields.lastName.label")}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder={t(
                  "addTeamMemberModal.fields.lastName.placeholder"
                )}
              />
              {hasFieldError("lastName") && (
                <p className="text-sm text-red-500">
                  {getFieldError("lastName")}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("addTeamMemberModal.fields.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("addTeamMemberModal.fields.email.placeholder")}
            />
            {hasFieldError("email") && (
              <p className="text-sm text-red-500">{getFieldError("email")}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              {t("addTeamMemberModal.fields.password.label")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={t(
                  "addTeamMemberModal.fields.password.placeholder"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {hasFieldError("password") && (
              <p className="text-sm text-red-500">
                {getFieldError("password")}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              {" "}
              {t("addTeamMemberModal.fields.role.label")}
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("addTeamMemberModal.fields.role.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Moderator">
                  {t("addTeamMemberModal.fields.role.options.moderator")}
                </SelectItem>
                <SelectItem value="Staff">
                  {t("addTeamMemberModal.fields.role.options.staff")}
                </SelectItem>
                <SelectItem value="Client">
                  {t("addTeamMemberModal.fields.role.options.client")}
                </SelectItem>
              </SelectContent>
            </Select>
            {hasFieldError("role") && (
              <p className="text-sm text-red-500">{getFieldError("role")}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="flex-1"
              disabled={isAdding}
            >
              {t("addTeamMemberModal.buttons.cancel")}
            </Button>
            <Button type="submit" className="flex-1" disabled={isAdding}>
              {isAdding ? (
                <>
                  <Loader className="w-4 h-4 mr-1 animate-spin" />
                  {t("addTeamMemberModal.buttons.adding")}
                </>
              ) : (
                t("addTeamMemberModal.buttons.add")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
