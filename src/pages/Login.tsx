
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    navigate('/onboarding')
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
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-48 bg-white/20 rounded-lg backdrop-blur-sm p-4">
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
        </div>

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
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Welcome to GMB Briefcase
          </h1>
          <p className="text-xl text-blue-100 text-center">
            Your All-in-One Google Business Management Suite
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
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="mt-1 h-12 text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            >
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
