
import React from "react";
import { WelcomeSection } from "./WelcomeSection";
import { LoginForm } from "./LoginForm";
import { useThemeLoader } from "@/hooks/useThemeLoader";

export const LoginLayout = () => {
  // Load theme customization on login page
  useThemeLoader();

  return (
    <div className="min-h-screen flex">
      <WelcomeSection />
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
};
