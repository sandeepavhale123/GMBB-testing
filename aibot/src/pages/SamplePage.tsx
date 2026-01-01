import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

const SamplePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <LayoutDashboard className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Welcome to GMB Briefcase
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Your Google Business Profile management platform
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              This is your sample landing page. Navigate to Settings to configure your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SamplePage;
