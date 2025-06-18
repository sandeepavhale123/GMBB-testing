import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { toast, useToast } from "@/hooks/use-toast";
import { setLoading } from "@/store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
const Login = () => {
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
      navigate("/");
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
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-lg backdrop-blur-sm"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-white/10 rounded backdrop-blur-sm"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-lg backdrop-blur-sm"></div>

        {/* Browser Mockup */}
        {/* <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-48 bg-white/20 rounded-lg backdrop-blur-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-white/30 rounded w-3/4"></div>
            <div className="h-3 bg-white/30 rounded w-1/2"></div>
            <div className="h-3 bg-white/30 rounded w-2/3"></div>
          </div>
         </div> */}

        {/* Logo */}
        <div className="absolute top-8 left-8">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <img
              src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png"
              alt="GMB Briefcase Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="flex flex-col justify-center items-center px-16 z-10">
          <img
            style={{
              height: "auto",
              width: "90%",
              maxWidth: "250px",
              marginBottom: "30px",
            }}
            src="/lovable-uploads/1925fff2-0bb1-4c0c-a281-a1a23bc5622b.png"
          />
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Manage Your GMB Listing Like a Pro
          </h1>
          <p className="text-md text-blue-100 text-center">
            Take charge of your local SEO efforts with powerful tools designed
            to simplify your Google Business Profile management. Schedule posts,
            monitor reviews, track performance, and boost your local visibility
            — all from one intuitive dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
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
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
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
      </div>
    </div>
  );
};
export default Login;
