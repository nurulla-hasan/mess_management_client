
import { ExpenseStats } from "@/components/dashboard/expenses/ExpenseStats";
import { ExpenseTable } from "@/components/dashboard/expenses/ExpenseTable";
import PageHeader from "@/components/ui/custom/page-header";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { getExpenses, getExpenseStats } from "@/services/expense";
import { getDepositSummary } from "@/services/deposit";

interface ExpensesPageProps {
  searchParams: Promise<{ 
    month?: string; 
    year?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const { 
    month: paramMonth, 
    year: paramYear, 
    page: paramPage,
    limit: paramLimit 
  } = await searchParams;

  const month = paramMonth ? parseInt(paramMonth) : new Date().getMonth() + 1;
  const year = paramYear ? parseInt(paramYear) : new Date().getFullYear();
  const page = paramPage ? parseInt(paramPage) : 1;
  const limit = paramLimit ? parseInt(paramLimit) : 10;

  const [expenseData, stats, depositSummary] = await Promise.all([
    getExpenses(month, year, page, limit),
    getExpenseStats(month, year),
    getDepositSummary(month, year),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader 
        title="Market Expenses" 
        description="Track and manage bazar/market tracking for current cycle."
      >
        <Button>
            <ShoppingCart />
            Add Expense
        </Button>
      </PageHeader>
      
      <ExpenseStats 
        totalExpense={stats?.totalExpense || 0}
        totalCollected={depositSummary?.totalCollected || 0}
        remainingBudget={stats?.remainingBudget || 0}
      />
      
      <ExpenseTable 
        expenses={expenseData?.expenses || []}
        pagination={expenseData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }}
      />
    </div>
  );
}
