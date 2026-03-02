
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealRateTrend } from "@/services/report";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MealRateChartProps {
  data: MealRateTrend[];
}

export function MealRateChart({ data }: MealRateChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Monthly Meal Rate Trend (BDT)</CardTitle>
        <span className="text-xs text-muted-foreground uppercase">Last 6 Months</span>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-50 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "8px", 
                  border: "none", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)"
                }}
                itemStyle={{ color: "var(--primary)", fontWeight: "bold" }}
                formatter={(value) => [`৳${value}`, "Rate"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--primary)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
