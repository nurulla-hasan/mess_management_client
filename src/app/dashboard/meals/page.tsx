
import { MealCalendar } from "@/components/dashboard/meals/MealCalendar";
import { MonthlySummary } from "@/components/dashboard/meals/MonthlySummary";
import { MessFundStatus } from "@/components/dashboard/meals/MessFundStatus";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PlusCircle } from "lucide-react";
import { getMeals, getMealSummary } from "@/services/meal";
import { getDepositSummary } from "@/services/deposit";
import PageHeader from "@/components/ui/custom/page-header";

interface MealsPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function MealsPage({ searchParams }: MealsPageProps) {
  const { month: paramMonth, year: paramYear } = await searchParams;
  
  const month = paramMonth ? parseInt(paramMonth) : new Date().getMonth() + 1;
  const year = paramYear ? parseInt(paramYear) : new Date().getFullYear();
  
  // Construct current date for Calendar
  const currentDate = new Date(year, month - 1, 1);

  // Parallel data fetching
  const [meals, summary, depositSummary] = await Promise.all([
    getMeals(month, year),
    getMealSummary(month, year),
    getDepositSummary(month, year),
  ]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader 
        title="Meal Management" 
        description="Review and record daily meal consumption for members."
      >
        <Button className="h-10">
            <PlusCircle className="mr-2 h-4 w-4" />
            Daily Meal Entry
        </Button>
      </PageHeader>
      
      <div className="flex-1 min-h-125">
        <MealCalendar meals={meals} currentDate={currentDate} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MonthlySummary summary={summary} currentDate={currentDate} />
        </div>
        <div className="lg:col-span-1">
          <MessFundStatus 
            totalCollected={depositSummary?.totalCollected || 0}
            totalExpense={summary?.totalExpense || 0} 
          />
        </div>
      </div>
    </div>
  );
}
