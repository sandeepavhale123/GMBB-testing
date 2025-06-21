
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleAuthHandler from "./GoogleAuthHandler";

const ConnectGoogleStep = () =>
  // {formData,
  // updateFormData,
  // onNext,}
  //: ConnectGoogleStepProps
  {
    const { toast } = useToast();
    const {
      currentStep,
      formData,
      updateData,
      setOauthParameters,
      oauthParams,
    } = useOnboarding();

    const localdomain = window.location.host;

    const navigate = useNavigate();
    const { search } = useLocation();

    // const handleSkip = () => {
    //   updateFormData({ googleConnected: false });
    //   onNext();
    // };

    // Check for OAuth parameters on component mount and when search changes

    useEffect(() => {
      const searchParams = new URLSearchParams(search);
      const hasGoogleCode = searchParams.get("code");

      console.log(
        "Inside onboarding page searchParams, and code",
        searchParams,
        hasGoogleCode,
        "processed:",
        oauthParams.processed
      );
      if (!hasGoogleCode) return;

      if (hasGoogleCode && !oauthParams.code && !oauthParams.processed) {
        console.log("Setting OAuth parameters");
        setOauthParameters(hasGoogleCode, searchParams, false); // let GoogleAuthHandler mark it as processed
      }
    }, [search, setOauthParameters]);

    // If we have OAuth parameters, show the GoogleAuthHandler
    if (oauthParams.code) {
      return <GoogleAuthHandler />;
    }

    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6">
       

        <Card className="p-4 sm:p-6 lg:p-8 border-2 border-gray-200">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Secure Google Authentication
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              We use Google's secure OAuth system to connect your account. Your
              credentials are never stored on our servers.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-green-800">
                View and manage your business information
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-green-800">
                Read and respond to customer reviews
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-green-800">
                Create and manage posts
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-green-800">
                Access performance insights
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm sm:text-base text-blue-900 mb-1">
                  What happens next?
                </h4>
                <p className="text-xs sm:text-sm text-blue-800">
                  You'll be redirected to Google to sign in and authorize GMB
                  Briefcase. Once connected, we'll import your business listings
                  automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <a
              href={`https://api.gmbbriefcase.com/api/v1/google-auth?domain=${localdomain}/onboarding`}
            >
              <Button
                variant="outline"
                className="w-full h-10 text-sm sm:text-base"
              >
                <>
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                  />
                  Connect with Google
                </>
              </Button>
            </a>
          </div>
        </Card>

        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-500">
            By connecting, you agree to our{" "}
            <a 
              href="https://gmbbriefcase.com/payment-refund/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a 
              href="https://gmbbriefcase.com/privacy-policy/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    );
  };

export default ConnectGoogleStep;
