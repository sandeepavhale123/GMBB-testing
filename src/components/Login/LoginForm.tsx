import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { toast } from "@/hooks/use-toast";
import { setLoading } from "@/store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { loginSchema, LoginFormData } from "@/schemas/authSchemas";
import { useFormValidation } from "@/hooks/useFormValidation";

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { login, isLoading } = useAuthRedux();
  const {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
  } = useFormValidation(loginSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(credentials);

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }

    dispatch(setLoading(true));

    try {
      const loginResult = await login(credentials);
      // Check if subscription expired
      if (loginResult?.subscriptionExpired) {
        console.log(
          "🚫 Login successful but subscription expired - redirecting to subscription page"
        );

        toast({
          title: "Subscription Expired",
          description: "Your plan has expired. Please renew to continue.",
          variant: "destructive",
        });

        navigate("/settings/subscription");
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      const onboarding = Number(localStorage.getItem("onboarding"));
      const currentStep =
        onboarding !== 1
          ? localStorage.setItem("onboarding_current_step", "6")
          : localStorage.setItem("onboarding_current_step", "1");
      const resultRedirect =
        onboarding !== 1 ? "/location-dashboard/default" : "/onboarding";
      navigate(resultRedirect);
    } catch (err) {
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (hasFieldError(field)) clearFieldError(field);
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
        <h2 className="text-3xl font-bold text-gray-900">GMB Briefcase</h2>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="text"
            name="username"
            value={credentials.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder=""
            className={`mt-1 h-12 text-base ${
              hasFieldError("username") ? "border-red-500" : ""
            }`}
          />
          {hasFieldError("username") && (
            <p className="text-sm text-red-600">{getFieldError("username")}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder=""
              className={`h-12 text-base pr-12 ${
                hasFieldError("password") ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasFieldError("password") && (
            <p className="text-sm text-red-600">{getFieldError("password")}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </Label>
          </div>
          <button
            type="button"
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin" />
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </Button>

        {/* Signup Link */}
        {/* <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div> */}
      </form>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};
