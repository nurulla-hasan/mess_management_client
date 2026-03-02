
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseDistributionItem } from "@/services/report";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ExpenseDistributionProps {
  total: number;
  distribution: ExpenseDistributionItem[];
}

const COLORS: Record<string, string> = {
  "Market": "var(--chart-2)",
  "Rent": "var(--chart-1)",
  "Gas/Utility": "var(--chart-3)",
  "Other": "var(--chart-4)"
};

const DEFAULT_COLOR = "var(--muted)";

export function ExpenseDistribution({ total, distribution }: ExpenseDistributionProps) {
  // Filter out zero values to avoid empty segments
  const data = distribution.filter(item => item.value > 0).map(item => ({
    ...item,
    color: COLORS[item.name] || DEFAULT_COLOR
  }));

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Expense Distribution</CardTitle>
        <span className="text-xs text-muted-foreground uppercase">Current Month</span>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="h-50 w-50 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value, name, props) => [`${props.payload.percentage}% (৳${value})`, name]}
                 contentStyle={{ 
                   borderRadius: "8px", 
                   border: "none", 
                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                   backgroundColor: "var(--card)",
                   color: "var(--card-foreground)"
                 }}
                 itemStyle={{ color: "var(--foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl font-bold">৳{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center pl-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
