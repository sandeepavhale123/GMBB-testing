import React from "react";
import { Card } from "../ui/card";

interface InsightMetric {
  label: string;
  value: number;
  color: string;
}

interface InsightsGridProps {
  metrics: InsightMetric[];
}

export const InsightsGrid: React.FC<InsightsGridProps> = ({ metrics }) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      violet: "ring-1 ring-violet-200 text-violet-500",
      amber: "ring-1 ring-amber-200 text-amber-500",
      green: "ring-1 ring-green-400 text-green-600",
      red: "ring-1 ring-red-400 text-red-600",
      blue: "ring-1 ring-blue-400 text-blue-600",
    };
    return colorMap[color] || "ring-1 ring-gray-200 text-gray-500";
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* First row: 3 cards */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.slice(0, 3).map((metric, index) => (
            <Card
              key={index}
              className={`flex flex-col items-center justify-center p-3 h-18 rounded text-center ${getColorClasses(
                metric.color
              )}`}
            >
              <span className="text-sm">{metric.label}</span>
              <span className="text-sm font-semibold">{metric.value}</span>
            </Card>
          ))}
        </div>

        {/* Second row: 2 cards centered */}
        <div className=" flex justify-center gap-4">
          {/* <div></div> */}
          {metrics.slice(3, 5).map((metric, index) => (
            <Card
              key={index + 3}
              className={`flex flex-col items-center justify-center p-3 h-18 w-full lg:max-w-40 md:max-w-32 sm:max-w-24 rounded text-center ${getColorClasses(
                metric.color
              )}`}
            >
              <span className="text-sm">{metric.label}</span>
              <span className="text-sm font-semibold">{metric.value}</span>
            </Card>
          ))}
          {/* <div></div> */}
        </div>

        {/* Third row: 3 cards */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.slice(5, 8).map((metric, index) => (
            <Card
              key={index + 5}
              className={`flex flex-col items-center justify-center p-3 h-18 rounded text-center ${getColorClasses(
                metric.color
              )}`}
            >
              <span className="text-sm">{metric.label}</span>
              <span className="text-sm font-semibold">{metric.value}</span>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};
