
import React from "react";
import { CheckCircle, Sparkles } from "lucide-react";

export const SuccessAnimation = () => {
  return (
    <div className="relative">
      {/* Main success icon with animation */}
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 animate-scale-in">
        <CheckCircle className="h-12 w-12 text-green-600 animate-pulse" />
      </div>
      
      {/* Sparkles animation */}
      <div className="absolute -top-2 -left-2">
        <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <div className="absolute -top-1 -right-3">
        <Sparkles className="h-4 w-4 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute -bottom-2 -left-3">
        <Sparkles className="h-5 w-5 text-purple-400 animate-bounce" style={{ animationDelay: '0.8s' }} />
      </div>
      <div className="absolute -bottom-1 -right-2">
        <Sparkles className="h-4 w-4 text-pink-400 animate-bounce" style={{ animationDelay: '1.1s' }} />
      </div>
      
      {/* Confetti effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-transparent animate-fade-in" style={{ animationDelay: '0.3s' }}></div>
      </div>
      <div className="absolute top-2 left-1/4 transform -translate-x-1/2">
        <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-transparent animate-fade-in" style={{ animationDelay: '0.6s' }}></div>
      </div>
      <div className="absolute top-1 right-1/4 transform translate-x-1/2">
        <div className="w-1 h-7 bg-gradient-to-b from-blue-400 to-transparent animate-fade-in" style={{ animationDelay: '0.9s' }}></div>
      </div>
    </div>
  );
};
