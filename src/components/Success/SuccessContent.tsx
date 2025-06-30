
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SuccessAnimation } from "./SuccessAnimation";

export const SuccessContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "general";

  const getSuccessMessage = (type: string) => {
    switch (type) {
      case "password-reset":
        return {
          title: "Password Updated Successfully!",
          description: "Your password has been updated. You can now log in with your new password.",
        };
      case "payment":
        return {
          title: "Payment Successful!",
          description: "Thank you for your subscription! Your payment has been processed successfully.",
        };
      case "profile-update":
        return {
          title: "Profile Updated!",
          description: "Your profile has been successfully updated.",
        };
      case "verification":
        return {
          title: "Verification Complete!",
          description: "Your account has been successfully verified.",
        };
      default:
        return {
          title: "Success!",
          description: "Your action has been completed successfully.",
        };
    }
  };

  const { title, description } = getSuccessMessage(type);

  const handleGoToDashboard = () => {
    navigate("/location-dashboard/default");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center pb-4">
          <SuccessAnimation />
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-800 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {title}
            </h1>
            <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              {description}
            </p>
          </div>
          
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <Button 
              onClick={handleGoToDashboard} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
            
            {type !== "payment" && (
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full"
              >
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
