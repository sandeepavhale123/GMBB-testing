
import React from "react";
import { WelcomeSection } from "../Login/WelcomeSection";
import { NewPasswordForm } from "./NewPasswordForm";

export const NewPasswordLayout = () => {
  return (
    <div className="min-h-screen flex">
      <WelcomeSection />
      
      {/* Right Side - New Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <NewPasswordForm />
      </div>
    </div>
  );
};
