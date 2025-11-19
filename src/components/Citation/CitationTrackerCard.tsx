// src/components/Citation/CitationTrackerCard.tsx
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type TrackerData = {
  listed: number;
  notListed: number;
  listedPercent: number;
  totalChecked: number;
};

type Props = {
  trackerData?: TrackerData | null;
  t: (key: string) => string;
};

export const CitationTrackerCard: React.FC<Props> = React.memo(
  ({ trackerData, t }) => {
    const listed = trackerData?.listed || 0;
    const notListed = trackerData?.notListed || 0;
    const listedPercent = trackerData?.listedPercent || 0;

    const chartData = useMemo(
      () => [
        {
          name: t("citationPage.trackerCard.title"),
          value: listed,
          fill: "hsl(var(--primary))",
        },
        {
          name: t("citationPage.trackerCard.notListed"),
          value: notListed,
          fill: "hsl(var(--muted))",
        },
      ],
      // chartData depends on t, listed, notListed
      [t, listed, notListed]
    );

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">
            {t("citationPage.trackerCard.listed")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={48}
                    paddingAngle={2}
                    dataKey="value"
                    className="sm:!hidden"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={64}
                    paddingAngle={2}
                    dataKey="value"
                    className="hidden sm:!block"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-2-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {t("citationPage.trackerCard.listed")}
                </span>
                <span className="text-sm sm:text-lg font-semibold">
                  {listedPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:ml-4">
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm">
              <span>{t("citationPage.trackerCard.listed")}</span>
              <span className="font-semibold">{listed}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-muted text-muted-foreground rounded text-xs sm:text-sm">
              <span>{t("citationPage.trackerCard.notListed")}</span>
              <span className="font-semibold">{notListed}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);
