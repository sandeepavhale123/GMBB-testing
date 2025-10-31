import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ChannelCardProps {
  name: string;
  icon: string;
  status: "connected" | "not-connected";
  onConnect: () => void;
  onDisconnect: () => void;
  statusText: {
    connected: string;
    notConnected: string;
  };
  buttonText: {
    connect: string;
    disconnect: string;
  };
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  name,
  icon,
  status,
  onConnect,
  onDisconnect,
  statusText,
  buttonText,
}) => {
  const isConnected = status === "connected";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Icon and Name */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img
                src={icon}
                alt={name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-base truncate">
                {name}
              </h3>
              <Badge
                variant="outline"
                className={
                  isConnected
                    ? "bg-green-100 text-green-700 border-green-300 mt-2"
                    : "bg-gray-100 text-gray-600 border-gray-300 mt-2"
                }
              >
                {isConnected ? statusText.connected : statusText.notConnected}
              </Badge>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDisconnect}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {buttonText.disconnect}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    // Open channel URL in new tab
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={onConnect}>
                {buttonText.connect}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
