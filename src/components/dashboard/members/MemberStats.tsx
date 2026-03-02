import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MemberStats as MemberStatsType } from "@/services/member";

interface StatCardProps {
  title: string;
  value: string;
  statusText?: string;
  statusType?: "success" | "warning" | "neutral";
  icon?: React.ReactNode;
}

function StatCard({ title, value, statusText, statusType = "neutral", icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold mb-2", statusType === "warning" ? "text-red-500" : "")}>
          {value}
        </div>
        {statusText && (
          <div className="flex items-center text-xs">
            {icon && <span className="mr-1">{icon}</span>}
            <span
              className={cn(
                statusType === "success" && "text-green-500 font-medium",
                statusType === "warning" && "text-red-500 font-medium",
                statusType === "neutral" && "text-muted-foreground"
              )}
            >
              {statusText}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MemberStatsProps {
  stats: MemberStatsType | null;
}

export function MemberStats({ stats }: MemberStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingAmount = stats?.pendingSettlements || 0;
  const hasPending = pendingAmount > 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Active Members"
        value={stats?.totalMembers?.toString() || "0"}
        statusText="Active members in mess"
        statusType="success"
        icon={<CheckCircle2 className="h-3 w-3 text-green-500" />}
      />
      <StatCard
        title="Total Mess Balance"
        value={formatCurrency(stats?.totalBalance || 0)}
        statusText="Current collected funds"
        statusType="neutral"
      />
      <StatCard
        title="Pending Settlements"
        value={formatCurrency(pendingAmount)}
        statusText={hasPending ? "Needs attention" : "All cleared"}
        statusType={hasPending ? "warning" : "success"}
        icon={hasPending ? <AlertCircle className="h-3 w-3 text-red-500" /> : <CheckCircle2 className="h-3 w-3 text-green-500" />}
      />
    </div>
  );
}
