import React, { useState } from "react";
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
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useSignup } from "@/store/slices/auth/useSignUp";
import { signupSchema, SignupFormData } from "@/schemas/authSchemas";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useThemeLogo } from "@/hooks/useThemeLogo";

const PLAN_OPTIONS = [
  { value: "0", label: "Select Plan" },
  { value: "50", label: "7$ for 7-day trial" },
  { value: "55", label: "Enterprise - $560 PM" },
  { value: "54", label: "Agency - $299 PM" },
  { value: "53", label: "Pro - $199 PM" },
  { value: "52", label: "Business - $99 PM" },
];

export const SignupForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    agencyName: "",
    email: "",
    password: "",
    plan: "0",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading, error } = useSignup();
  const { lightLogo } = useThemeLogo();
  const {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
  } = useFormValidation(signupSchema);

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (hasFieldError(field)) clearFieldError(field);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      agencyName: "",
      email: "",
      password: "",
      plan: "0",
    });
    clearErrors();
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const getPayButtonLabel = () => {
    if (formData.plan === "0") return "Pay - Select Plan";
    const selectedPlan = PLAN_OPTIONS.find(
      (option) => option.value === formData.plan
    );
    return `Pay - ${selectedPlan?.label || "Select Plan"}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate(formData);

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields and try again.",
        variant: "destructive",
      });

      // Scroll to the first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    const success = await signup(formData);
    if (success) {
      console.log("✅ Signup completed successfully");
    } else {
      console.log("❌ Signup failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex justify-center lg:hidden mb-8">
        <img
          src={lightLogo}
          alt="GMB Briefcase Logo"
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-gray-600">Join GMB Briefcase today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`mt-1 h-12 ${
                hasFieldError("firstName") ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            {hasFieldError("firstName") && (
              <p className="text-sm text-red-600">
                {getFieldError("firstName")}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`mt-1 h-12 ${
                hasFieldError("lastName") ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            {hasFieldError("lastName") && (
              <p className="text-sm text-red-600">
                {getFieldError("lastName")}
              </p>
            )}
          </div>
        </div>

        {/* Agency Name */}
        <div>
          <Label htmlFor="agencyName">Agency Name *</Label>
          <Input
            id="agencyName"
            type="text"
            value={formData.agencyName}
            onChange={(e) => handleChange("agencyName", e.target.value)}
            className={`mt-1 h-12 ${
              hasFieldError("agencyName") ? "border-red-500" : ""
            }`}
            disabled={isLoading}
          />
          {hasFieldError("agencyName") && (
            <p className="text-sm text-red-600">
              {getFieldError("agencyName")}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="text"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`mt-1 h-12 ${
              hasFieldError("email") ? "border-red-500" : ""
            }`}
            disabled={isLoading}
          />
          {hasFieldError("email") && (
            <p className="text-sm text-red-600">{getFieldError("email")}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password *</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`h-12 pr-12 ${
                hasFieldError("password") ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasFieldError("password") && (
            <p className="text-sm text-red-600">{getFieldError("password")}</p>
          )}
        </div>

        {/* Plan Selection */}
        <div>
          <Label htmlFor="plan">Select Plan *</Label>
          <Select
            value={formData.plan}
            onValueChange={(value) => handleChange("plan", value)}
            disabled={isLoading}
          >
            <SelectTrigger
              id="plan"
              className={`mt-1 h-12 ${
                hasFieldError("plan") ? "border-red-500" : ""
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.value === "0"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFieldError("plan") && (
            <p className="text-sm text-red-600">{getFieldError("plan")}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-12 gap-3">
          <Button
            type="submit"
            className="h-12 font-medium rounded-lg col-span-8"
            disabled={isLoading || formData.plan === "0"}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" size={16} />
                Creating Account...
              </span>
            ) : (
              getPayButtonLabel()
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-12 font-medium rounded-lg col-span-4"
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-500 font-medium"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
