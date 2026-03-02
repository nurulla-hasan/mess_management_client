
import { ExpenseDistribution } from "@/components/dashboard/reports/ExpenseDistribution";
import { MealRateChart } from "@/components/dashboard/reports/MealRateChart";
import { ReportMonthSelector } from "@/components/dashboard/reports/ReportMonthSelector";
import { SettlementTable } from "@/components/dashboard/reports/SettlementTable";
import { ExportReportButton } from "@/components/dashboard/reports/ExportReportButton";
import PageHeader from "@/components/ui/custom/page-header";
import { getExpenseDistribution, getMealRateTrend, getSettlement } from "@/services/report";

interface ReportsPageProps {
  searchParams: Promise<{ 
    month?: string; 
    year?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { 
    month: paramMonth, 
    year: paramYear 
  } = await searchParams;

  const month = paramMonth ? parseInt(paramMonth) : new Date().getMonth() + 1;
  const year = paramYear ? parseInt(paramYear) : new Date().getFullYear();

  const [mealRateTrend, expenseDistribution, settlementData] = await Promise.all([
    getMealRateTrend(6, month, year),
    getExpenseDistribution(month, year),
    getSettlement(month, year),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full" id="report-content">
      <PageHeader
        title="Financial Reports"
        description="Detailed overview of monthly trends and settlements."
      >
        <div className="flex items-center gap-2">
          <ReportMonthSelector currentMonth={month} currentYear={year} />
          <ExportReportButton 
            month={month} 
            year={year}
            expenseDistribution={expenseDistribution}
            settlementData={settlementData}
            mealRateTrend={mealRateTrend}
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MealRateChart data={mealRateTrend || []} />
        <ExpenseDistribution 
          total={expenseDistribution?.total || 0} 
          distribution={expenseDistribution?.distribution || []} 
        />
      </div>

      <SettlementTable 
        settlement={settlementData?.settlement || []} 
        totals={settlementData?.totals || {
          totalMembersCount: 0,
          totalMeals: 0,
          totalMealCost: 0,
          totalFixedShare: 0,
          totalLiability: 0,
          totalDeposited: 0,
          totalBalance: 0,
        }} 
      />
    </div>
  );
}
