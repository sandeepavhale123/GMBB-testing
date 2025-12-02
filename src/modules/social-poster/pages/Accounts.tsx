import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ConnectedAccountsList } from "../components/accounts/ConnectedAccountsList";
import { ConnectPlatformDialog } from "../components/accounts/ConnectPlatformDialog";

export const SocialPosterAccounts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const connectStatus = searchParams.get("connect_status");
    const platform = searchParams.get("platform");
    const error = searchParams.get("error");
    const pages = searchParams.get("pages");
    const instagram = searchParams.get("instagram");
    const accounts = searchParams.get("accounts");
    const accountType = searchParams.get("account_type");

    if (connectStatus && platform) {
      if (connectStatus === "success") {
        const accountsConnected = [];
        
        // Handle Facebook/Instagram
        if (pages) accountsConnected.push(`${pages} Facebook page${parseInt(pages) > 1 ? 's' : ''}`);
        if (instagram) accountsConnected.push(`${instagram} Instagram account${parseInt(instagram) > 1 ? 's' : ''}`);
        
        // Handle LinkedIn
        if (platform === "linkedin" && accounts && accountType) {
          accountsConnected.push(`${accounts} LinkedIn ${accountType} account${parseInt(accounts) > 1 ? 's' : ''}`);
        }
        
        // Handle Twitter
        if (platform === "twitter" && !pages && !instagram) {
          accountsConnected.push("Twitter account");
        }
        
        // Handle Threads
        if (platform === "threads" && accounts) {
          accountsConnected.push(`${accounts} Threads account${parseInt(accounts) > 1 ? 's' : ''}`);
        }

        toast({
          title: "Connection Successful!",
          description: accountsConnected.length > 0 
            ? `Successfully connected ${accountsConnected.join(' and ')}`
            : `Successfully connected ${platform} account`,
        });
      } else if (connectStatus === "error") {
        toast({
          title: "Connection Failed",
          description: error || `Failed to connect ${platform} account`,
          variant: "destructive",
        });
      }

      // Clean up URL
      searchParams.delete("connect_status");
      searchParams.delete("platform");
      searchParams.delete("error");
      searchParams.delete("pages");
      searchParams.delete("instagram");
      searchParams.delete("accounts");
      searchParams.delete("account_type");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Accounts</h1>
            <p className="text-muted-foreground">
              Connect and manage your social media accounts
            </p>
          </div>
          <Button onClick={() => setShowConnectDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Connect New
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search accounts..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin_individual">LinkedIn (Individual)</SelectItem>
              <SelectItem value="linkedin_organisation">LinkedIn (Organisation)</SelectItem>
              <SelectItem value="threads">Threads</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Connected Accounts */}
        <ConnectedAccountsList 
          platformFilter={platformFilter} 
          statusFilter={statusFilter} 
          searchQuery={searchQuery}
        />

        {/* Connect Dialog */}
        <ConnectPlatformDialog open={showConnectDialog} onOpenChange={setShowConnectDialog} />
      </div>
  );
};
