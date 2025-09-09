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

const colorStyles = {
  green: "text-green-600 bg-green-50 border-green-200",
  yellow: "text-yellow-600 bg-yellow-50 border-yellow-200", 
  red: "text-red-600 bg-red-50 border-red-200",
  blue: "text-blue-600 bg-blue-50 border-blue-200"
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
    <Card className={`${colorStyles[color]} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          {icon && <div className="h-5 w-5">{icon}</div>}
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {subtitle && <span className="text-sm text-muted-foreground mb-1">{subtitle}</span>}
        </div>
        {percentage !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  color === 'green' ? 'bg-green-500' : 
                  color === 'yellow' ? 'bg-yellow-500' : 
                  color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};