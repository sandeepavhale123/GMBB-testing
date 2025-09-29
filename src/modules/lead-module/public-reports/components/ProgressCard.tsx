import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  percentage?: number;
  color?: "green" | "yellow" | "red" | "blue";
  icon?: React.ReactNode;
}

const valueColorStyles = {
  green: "text-green-600",
  yellow: "text-yellow-600", 
  red: "text-red-600",
  blue: "text-primary"
};

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  subtitle,
  percentage,
  color = "blue",
  icon
}) => {
  return (
    <Card className="bg-background border border-border">
      <CardContent className="p-6 text-center">
        <div className={`text-4xl font-bold mb-2 ${valueColorStyles[color]}`}>
          {value}{percentage !== undefined && '%'}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  );
};