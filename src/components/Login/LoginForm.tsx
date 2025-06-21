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

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuthRedux();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      await login(credentials);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            type="email"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder=""
            className="mt-1 h-12 text-base"
            required
          />
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
              onChange={handleChange}
              placeholder=""
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
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot Password?
          </a>
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
      </form>
    </div>
  );
};
