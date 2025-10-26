import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

export const Request: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Requests</h1>
          <p className="text-muted-foreground">
            Send review requests to your customers.
          </p>
        </div>
        <Button>
          <Send className="w-4 h-4 mr-2" />
          New Request Campaign
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Review Request Feature Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This feature will allow you to send automated review requests to
              your customers via email and SMS. Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
