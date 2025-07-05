import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader } from "../ui/card";
import { ChartDataItem } from "../../types/health";

interface InsightsChartProps {
  data: ChartDataItem[];
}

export const InsightsChart: React.FC<InsightsChartProps> = ({ data }) => {
  return (
    <Card className="p-2">
      <CardHeader className="text-lg font-semibold text-center pt-2 items-center gap-2">
        How customers search for your business
      </CardHeader>
      <div className="h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="40%"
              cy="50%"
              className="origin-center translate-x-2 translate-y-1 rotate-100"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={5}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              verticalAlign="top"
              align="center"
              layout="horizontal"
              iconType="square"
              wrapperStyle={{
                paddingLeft: "10px",
                fontSize: "13px",
                lineHeight: "20px",
              }}
              formatter={(value) => {
                const item = data.find((d) => d.name === value);
                return (
                  <span style={{ color: item?.fill }}>
                    {value} : {item?.count}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
