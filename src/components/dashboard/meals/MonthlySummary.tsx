/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { MealSummary } from "@/services/meal";
import { format } from "date-fns";
import { ExportReportButton } from "../reports/ExportReportButton";
import { useEffect, useState } from "react";
import { getExpenseDistribution, getMealRateTrend, getSettlement } from "@/services/report";

interface MonthlySummaryProps {
  summary: MealSummary | null;
  currentDate: Date;
}

export function MonthlySummary({ summary, currentDate }: MonthlySummaryProps) {
  const monthName = format(currentDate, "MMMM");
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const [reportData, setReportData] = useState<{
    mealRateTrend: any[] | null;
    expenseDistribution: any | null;
    settlementData: any | null;
  }>({
    mealRateTrend: null,
    expenseDistribution: null,
    settlementData: null,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      const [mealRateTrend, expenseDistribution, settlementData] = await Promise.all([
        getMealRateTrend(6, month, year),
        getExpenseDistribution(month, year),
        getSettlement(month, year),
      ]);
      setReportData({ mealRateTrend, expenseDistribution, settlementData });
    };
    fetchReportData();
  }, [month, year]);

  if (!summary) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold">
              {monthName} Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              No data available for this month
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold">
            {monthName} Summary (Live Statistics)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregated meal data in BDT currency
          </p>
        </div>
        <ExportReportButton
          month={month}
          year={year}
          expenseDistribution={reportData.expenseDistribution}
          settlementData={reportData.settlementData}
          mealRateTrend={reportData.mealRateTrend}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {/* Total Meals */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Meals
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{summary.totalMeals}</span>
              <span className="text-xs font-medium text-muted-foreground">
                Count
              </span>
            </div>
            {/* Trend placeholder - could be calculated if we had previous month data */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>Active</span>
            </div>
          </div>

          {/* Total Bazar */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Bazar
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{summary.totalBazar.toLocaleString()}</span>
              <span className="text-xs font-medium text-muted-foreground">
                BDT
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              All recorded shopping expenses
            </p>
          </div>

          {/* Current Rate */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Current Rate
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-green-600 dark:text-green-500">
                {summary.currentRate.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                BDT
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Per individual meal unit
            </p>
          </div>

          {/* Other Costs */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Other Costs
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-500">
                {summary.extraCosts.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                BDT
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Utilities, cook, & others
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
