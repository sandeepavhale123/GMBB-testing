import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SEO Fixer Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure module-level settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Module settings will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
