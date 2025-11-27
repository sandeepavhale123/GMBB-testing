import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend , Tooltip } from "recharts";
import { FileImage } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";


interface MediaStatsChartProps {
  imageCount: number;
  videoCount: number;
  isLoading?: boolean;
}

export const MediaStatsChart: React.FC<MediaStatsChartProps> = ({
  imageCount,
  videoCount,
  isLoading = false,
}) => {
  const { t } = useI18nNamespace("Media/mediaStatsChart");
  const data = [
    {
      name: t("mediaStatsChart.images"),
      count: imageCount,
      views: imageCount * 50,
      fill: "#3b82f6",
    },
    {
      name: t("mediaStatsChart.videos"),
      count: videoCount,
      views: videoCount * 92,
      fill: "#10b981",
    },
  ];

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            {t("mediaStatsChart.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <Skeleton className="w-32 h-32 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state when no media data
  if (imageCount === 0 && videoCount === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            {t("mediaStatsChart.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            {t("mediaStatsChart.noData", "No media data available")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          {t("mediaStatsChart.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="40%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, `${name}`]}
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{
                  paddingLeft: "20px",
                  fontSize: "14px",
                }}
                formatter={(value) => {
                  const item = data.find((d) => d.name === value);
                  return (
                    <span style={{ color: item?.fill }}>
                      {item?.count} {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
