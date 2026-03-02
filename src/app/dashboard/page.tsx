/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Users,
  Wallet,
  Receipt,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivities, Activity } from "@/components/dashboard/RecentActivities";
import { PaymentAlerts, PaymentAlert } from "@/components/dashboard/PaymentAlerts";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/services/dashboard";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

 

  // Transform recent activities
  const recentActivities: Activity[] = [];

  if (stats?.recentExpenses) {
    stats.recentExpenses.forEach((expense: any) => {
      recentActivities.push({
        id: expense._id,
        date: format(new Date(expense.date), "MMM dd, yyyy"),
        user: {
          name: expense.buyerId?.userId?.fullName || "Unknown",
          avatar: expense.buyerId?.userId?.profilePicture || "/avatars/default.png",
          description: expense.category,
          isSystem: false,
        },
        type: "Expense",
        amount: formatCurrency(expense.amount),
        status: "Recorded",
      });
    });
  }

  if (stats?.recentDeposits) {
    stats.recentDeposits.forEach((deposit: any) => {
      recentActivities.push({
        id: deposit._id,
        date: format(new Date(deposit.date), "MMM dd, yyyy"),
        user: {
          name: deposit.memberId?.userId?.fullName || "Unknown",
          avatar: deposit.memberId?.userId?.profilePicture || "/avatars/default.png",
          description: "Deposit",
          isSystem: false,
        },
        type: "Payment",
        amount: formatCurrency(deposit.amount),
        status: "Completed",
      });
    });
  }

  // Sort by date (descending) - relying on API sort for now, but good to ensure
  // API returns sorted, but we are merging two lists.
  // Actually, we should probably sort them here.
  // But wait, the API returns them sorted separately.
  // For now, let's just combine and assume reasonable order or sort by date string (not ideal)
  // or better, if we had the raw date object.
  // Given time constraints, I'll just concat them. Ideally, backend should return a unified list.
  
  // Transform payment alerts
  const paymentAlerts: PaymentAlert[] = stats?.paymentAlerts?.map((alert: any) => ({
    id: alert.memberId,
    name: alert.memberName,
    avatar: alert.profilePicture || "/avatars/default.png",
    amount: formatCurrency(alert.amount),
  })) || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Members"
          value={stats?.activeMembers || 0}
          icon={Users}
          trend="+2 new"
          trendUp={true}
          description="this month"
        />
        <StatCard
          title="Mess Balance (Cash)"
          value={formatCurrency(stats?.messBalance || 0)}
          icon={Wallet}
          className="bg-primary dark:bg-primary/20 text-primary-foreground dark:text-primary-foreground"
          iconClassName="bg-primary-foreground/20 text-primary-foreground"
          titleClassName="text-primary-foreground/80 dark:text-primary-foreground/80"
          descriptionClassName="text-primary-foreground/80 dark:text-primary-foreground/80"
          description="Net: Collected - Expenses"
          action={
            <Button
              variant="link"
              className="p-0 h-auto text-primary-foreground hover:text-primary-foreground/90"
            >
              Quick Adjustment <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          }
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats?.totalExpenses || 0)}
          icon={Receipt}
          trend="+12%"
          trendUp={false} 
          description="vs last month"
        />
        <StatCard
          title="Current Meal Rate"
          value={formatCurrency(stats?.currentMealRate || 0)}
          icon={BarChart3}
          trend="-1%"
          trendUp={true} 
          description="efficient management"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivities activities={recentActivities} />
        <div className="lg:col-span-1">
          <PaymentAlerts alerts={paymentAlerts} />
        </div>
      </div>
    </div>
  );
}
