import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, ImageIcon, Youtube, MessageSquare, Loader2, User, Building2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { LinkedInAccountTypeDialog } from "./LinkedInAccountTypeDialog";

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
}

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  secondaryIcon?: React.ElementType;
  color: string;
  enabled: boolean;
  description: string;
}

const platforms: Platform[] = [
  { 
    id: "facebook-instagram", 
    name: "Facebook & Instagram", 
    icon: FaFacebookF,
    secondaryIcon: Instagram, 
    color: "hsl(221, 75%, 55%)", 
    enabled: true,
    description: "Connect both platforms with single OAuth"
  },
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "hsl(0, 0%, 0%)", enabled: true, description: "Connect your Twitter/X account" },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedinIn, color: "hsl(201, 100%, 35%)", enabled: true, description: "Connect your LinkedIn account" },
  { id: "threads", name: "Threads", icon: MessageSquare, color: "hsl(0, 0%, 0%)", enabled: true, description: "Connect your Threads account" },
  { id: "pinterest", name: "Pinterest", icon: ImageIcon, color: "hsl(0, 78%, 52%)", enabled: false, description: "Coming soon" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "hsl(0, 100%, 50%)", enabled: false, description: "Coming soon" },
];

interface ConnectPlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectPlatformDialog: React.FC<ConnectPlatformDialogProps> = ({ open, onOpenChange }) => {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [showLinkedInDialog, setShowLinkedInDialog] = useState(false);

  const handleConnect = async (platformId: string, enabled: boolean) => {
    if (!enabled) return;
    
    if (platformId === "facebook-instagram") {
      setConnectingPlatform(platformId);
      
      try {
        const frontendOrigin = window.location.origin;
        const response = await axiosInstance.get(
          `/social-poster/accounts/connect/facebook/init?frontend_origin=${encodeURIComponent(frontendOrigin)}`
        );
        
        if (response.data.code === 200 && response.data.data?.auth_url) {
          window.location.href = response.data.data.auth_url;
        } else {
          toast.error("Failed to initialize OAuth");
          setConnectingPlatform(null);
        }
      } catch (error: any) {
        console.error("OAuth init error:", error);
        toast.error(error.response?.data?.message || "Failed to connect account");
        setConnectingPlatform(null);
      }
    } else if (platformId === "twitter") {
      setConnectingPlatform(platformId);
      
      try {
        const frontendOrigin = window.location.origin;
        const response = await axiosInstance.get(
          `/social-poster/accounts/connect/twitter/init?frontend_origin=${encodeURIComponent(frontendOrigin)}`
        );
        
        if (response.data.code === 200 && response.data.data?.auth_url) {
          window.location.href = response.data.data.auth_url;
        } else {
          toast.error("Failed to initialize OAuth");
          setConnectingPlatform(null);
        }
      } catch (error: any) {
        console.error("OAuth init error:", error);
        toast.error(error.response?.data?.message || "Failed to connect account");
        setConnectingPlatform(null);
      }
    } else if (platformId === "linkedin") {
      // Show LinkedIn account type selection dialog
      setShowLinkedInDialog(true);
    } else if (platformId === "threads") {
      setConnectingPlatform(platformId);
      
      try {
        const frontendOrigin = window.location.origin;
        const response = await axiosInstance.get(
          `/social-poster/accounts/connect/threads/init?frontend_origin=${encodeURIComponent(frontendOrigin)}`
        );
        
        if (response.data.code === 200 && response.data.data?.auth_url) {
          window.location.href = response.data.data.auth_url;
        } else {
          toast.error("Failed to initialize OAuth");
          setConnectingPlatform(null);
        }
      } catch (error: any) {
        console.error("OAuth init error:", error);
        toast.error(error.response?.data?.message || "Failed to connect account");
        setConnectingPlatform(null);
      }
    } else {
      toast.info("This platform is coming soon");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Connect Social Media Accounts</DialogTitle>
            <DialogDescription>
              Choose which platforms you want to connect
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4 md:grid-cols-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const SecondaryIcon = platform.secondaryIcon;

              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full relative"
                      style={{ backgroundColor: platform.color }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                      {SecondaryIcon && (
                        <div
                          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
                          style={{ backgroundColor: "hsl(330, 75%, 50%)" }}
                        >
                          <SecondaryIcon className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      <p className="text-xs text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleConnect(platform.id, platform.enabled)}
                    disabled={!platform.enabled || connectingPlatform === platform.id}
                  >
                    {connectingPlatform === platform.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <LinkedInAccountTypeDialog 
        open={showLinkedInDialog} 
        onOpenChange={setShowLinkedInDialog}
      />
    </>
  );
};
