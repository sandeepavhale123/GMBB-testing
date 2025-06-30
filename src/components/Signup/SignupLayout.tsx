
import React from "react";
import { WelcomeSection } from "../Login/WelcomeSection";
import { SignupForm } from "./SignupForm";

export const SignupLayout = () => {
  return (
    <div className="min-h-screen flex">
      <WelcomeSection />
      
      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <SignupForm />
      </div>
    </div>
  );
};
