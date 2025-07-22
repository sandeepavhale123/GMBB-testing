import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, LoaderCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useQueryParams } from "@/hooks/useQueryParams";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/schemas/authSchemas";
export const NewPasswordForm = () => {
  const [passwords, setPasswords] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = useQueryParams("u");
  // console.log("token value", token);

  const { validate, getFieldError, hasFieldError, clearFieldError } =
    useFormValidation(resetPasswordSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    const validation = validate(passwords);
    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual password reset API call
      const response = await fetch(`${BASE_URL}/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetKey: token,
          newPassword: passwords.newPassword,
          cnfPassword: passwords.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Reset Failed",
          description:
            data.message ||
            "An error occurred while resetting your password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Reset Successful",
          description: data.message,
        });
        // Navigate to success page
        navigate("/success?type=password-reset");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (hasFieldError(name)) {
      clearFieldError(name);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Mobile Logo */}
      <div className="flex justify-center lg:hidden mb-8">
        <img
          src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png"
          alt="GMB Briefcase Logo"
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
        <p className="mt-2 text-gray-600">
          Create a strong password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="newPassword" className="text-gray-700">
            New Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder=""
              className={`h-12 text-base pr-12 ${
                hasFieldError("newPassword") ? "border-red-500" : ""
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasFieldError("newPassword") && (
            <p className="text-sm text-red-500 mt-1">
              {getFieldError("newPassword")}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700">
            Confirm Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder=""
              className={`h-12 text-base pr-12 ${
                hasFieldError("confirmPassword") ? "border-red-500" : ""
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasFieldError("confirmPassword") && (
            <p className="text-sm text-red-500 mt-1">
              {getFieldError("confirmPassword")}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin" />
              Updating Password...
            </span>
          ) : (
            "Update Password"
          )}
        </Button>

        {/* Back to Login Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};
