import { DashboardHeader } from "@/components/members-dashboard/dashboard-header"
import { StatsCards } from "@/components/members-dashboard/stats-cards"
import { MealHistory } from "@/components/members-dashboard/meal-history"
import { MessSummary } from "@/components/members-dashboard/mess-summary"
import { DepositHistory } from "@/components/members-dashboard/deposit-history"
import { MessManagement } from "@/components/members-dashboard/mess-management"
import { MealOffDeadline } from "@/components/members-dashboard/meal-off-deadline"
import { getMemberDashboardStats } from "@/services/dashboard"
import { getCurrentUser } from "@/services/auth"
import SetupMess from "@/components/dashboard/SetupMess"
import { redirect } from "next/navigation"

export default async function MemberPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.messId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <SetupMess user={user} />
      </div>
    );
  }

  const data = await getMemberDashboardStats();

  if (!data) {
    return <div>Failed to load dashboard data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {data.messName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your member dashboard.
        </p>
      </div>
      <DashboardHeader user={data.memberInfo} month={data.month} />
      <StatsCards stats={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MealHistory recentMeals={data.recentMeals} />
        </div>
        <div>
          <MessSummary financials={data.financials} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DepositHistory recentDeposits={data.recentDeposits} />
        </div>
        <div className="space-y-6">
          <MessManagement user={data.memberInfo} />
          <MealOffDeadline />
        </div>
      </div>
    </div>
  )
}
