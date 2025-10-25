import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export const Setting: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your reputation management preferences
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <SettingsIcon className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Settings Configuration Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Configure notification preferences, channel connections, and
              automation rules. This feature is currently in development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
