
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SignupFormData {
  firstName: string;
  lastName: string;
  agencyName: string;
  email: string;
  password: string;
  currency: string;
  plan: string;
}

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
];

const PLAN_OPTIONS = [
  { value: "0", label: "Select Plan" },
  { value: "50", label: "7$ for 7-day trial" },
  { value: "55", label: "Briefcase-Enterprise - $560 PM" },
  { value: "54", label: "Briefcase-Agency - $299 PM" },
  { value: "53", label: "Briefcase-Pro - $199 PM" },
  { value: "52", label: "Briefcase-Business - $99 PM" },
];

export const SignupForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    agencyName: "",
    email: "",
    password: "",
    currency: "USD",
    plan: "0",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      agencyName: "",
      email: "",
      password: "",
      currency: "USD",
      plan: "0",
    });
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.agencyName || 
        !formData.email || !formData.password || formData.plan === "0") {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual signup logic when authentication system is integrated
      console.log("Signup form data:", formData);
      
      toast({
        title: "Success",
        description: "Account created successfully! Redirecting to payment...",
      });
      
      // For now, just show success and redirect after delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
        <p className="mt-2 text-gray-600">Join GMB Briefcase today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700">
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="John"
              className="mt-1 h-12 text-base"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-700">
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Doe"
              className="mt-1 h-12 text-base"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="agencyName" className="text-gray-700">
            Agency Name *
          </Label>
          <Input
            id="agencyName"
            type="text"
            value={formData.agencyName}
            onChange={(e) => handleChange("agencyName", e.target.value)}
            placeholder="Your Agency Name"
            className="mt-1 h-12 text-base"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
            className="mt-1 h-12 text-base"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700">
            Password *
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Create a strong password"
              className="h-12 text-base pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Business Configuration */}
        <div>
          <Label htmlFor="currency" className="text-gray-700">
            Currency
          </Label>
          <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
            <SelectTrigger className="mt-1 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="plan" className="text-gray-700">
            Select Plan *
          </Label>
          <Select value={formData.plan} onValueChange={(value) => handleChange("plan", value)}>
            <SelectTrigger className="mt-1 h-12">
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
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            disabled={isLoading || formData.plan === "0"}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Pay with Selected Plan"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full h-12 font-medium rounded-lg"
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
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
