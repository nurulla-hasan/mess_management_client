"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface MessSummaryProps {
  financials: {
    totalDeposited: number;
    totalLiability: number;
    currentBalance: number;
  };
}

export function MessSummary({ financials }: MessSummaryProps) {
  const data = [
    { name: "Deposited", value: financials.totalDeposited, color: "#10B981" }, // Emerald-500
    { name: "Cost", value: financials.totalLiability, color: "#EF4444" },     // Red-500
  ];

  const balance = financials.currentBalance;
  const statusColor = balance >= 0 ? "text-emerald-600" : "text-red-600";

  return (
    <Card className="h-full border shadow-sm flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center">
        <div className="h-50 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)'
                }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className={`text-2xl font-bold ${statusColor}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {balance >= 0 ? "You are in safe zone" : "Please deposit soon"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
