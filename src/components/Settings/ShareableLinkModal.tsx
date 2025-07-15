import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareableLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
}

export const ShareableLinkModal: React.FC<ShareableLinkModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
  const [copied, setCopied] = useState(false);
  const [allowedListings, setAllowedListings] = useState("397");
  
  if (!member) return null;

  const shareableLink = `https://yourapp.com/login?token=${member.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Shareable link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleOpenLink = () => {
    window.open(shareableLink, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share External URL for Client to Onboard Account and Listing Access</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Share this link with{" "}
            <span className="font-medium text-gray-900">
              {member.firstName} {member.lastName}
            </span>{" "}
            to give them direct access to their account and listing management.
          </div>

          {/* Allow Listings Field */}
          <div className="space-y-2">
            <Label htmlFor="allowed-listings">Enter Allow Listings: Available spots on the Dashboard - 397</Label>
            <Input
              id="allowed-listings"
              value={allowedListings}
              onChange={(e) => setAllowedListings(e.target.value)}
              placeholder="Enter allowed listings count"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shareable-link">Direct Access Link</Label>
            <div className="flex gap-2">
              <Input
                id="shareable-link"
                value={shareableLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 text-sm mb-2">
              Link Details:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Valid for direct login access</li>
              <li>• Bypasses standard login process</li>
              <li>• Role-based permissions apply</li>
              <li>• Can be revoked by deleting the user</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={handleOpenLink}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};