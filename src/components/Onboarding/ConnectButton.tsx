
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConnectButtonProps {
  selectedCount: number;
  isConnecting: boolean;
  onConnect: () => void;
}

const ConnectButton = ({
  selectedCount,
  isConnecting,
  onConnect,
}: ConnectButtonProps) => {
  return (
    <div className="text-center">
      <Button
        onClick={onConnect}
        disabled={selectedCount === 0 || isConnecting}
        className="px-8 py-3 text-base"
        size="lg"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Connecting...
          </>
        ) : (
          `Connect with ${selectedCount} listing${selectedCount !== 1 ? 's' : ''}`
        )}
      </Button>
    </div>
  );
};

export default ConnectButton;
