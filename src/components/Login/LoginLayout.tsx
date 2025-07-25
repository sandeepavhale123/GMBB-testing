
import React from "react";
import { WelcomeSection } from "./WelcomeSection";
import { LoginForm } from "./LoginForm";

export const LoginLayout = () => {
  // Theme loading is now handled by ThemePreloader wrapper

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
