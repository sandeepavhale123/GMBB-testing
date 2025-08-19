import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const localdomain = window.location.host;
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const isMultiDashboard =
        window.location.pathname.startsWith("/main-dashboard");

      // Save state in localStorage
      localStorage.setItem(
        "oauth_origin",
        isMultiDashboard ? "multi" : "single"
      );
      const state = localStorage.getItem("oauth_origin");
      if (state == "multi") {
        const authUrl = `${
          import.meta.env.VITE_BASE_URL
        }/google-auth?domain=${localdomain}/main-dashboard/settings`;

        window.location.href = authUrl; // Redirect to backend OAuth start
      } else {
        const authUrl = `${
          import.meta.env.VITE_BASE_URL
        }/google-auth?domain=${localdomain}/settings`;

        window.location.href = authUrl; // Redirect to backend OAuth start
      }

      setIsConnecting(false);
    } catch (err) {
      // console.log("error", err);
      toast({
        title: "Connection Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to initiate Google connection",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Google Business Account</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">
                Google Business Profile Required
              </p>
              <p className="text-blue-700">
                You'll need to authenticate with Google and grant access to your
                Business Profile listings.
              </p>
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="email">Google Account Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Google account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}

          <div className="text-sm text-gray-600">
            <p className="mb-2">
              After clicking "Connect Account", you'll be redirected to Google
              to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Sign in to your Google account</li>
              <li>Grant access to your Business Profile data</li>
              <li>Authorize listing management permissions</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <ExternalLink className="h-4 w-4 text-gray-500" />
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Don't have a Google Business Profile? Create one here
            </a>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <span>Connect Account</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
