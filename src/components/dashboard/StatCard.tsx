import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  action?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  description,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  action,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className={cn("text-sm font-medium text-muted-foreground", titleClassName)}>
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full bg-muted/20", iconClassName)}>
          <Icon className={cn("h-4 w-4", titleClassName ? titleClassName : "text-muted-foreground")} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <p className={cn("text-xs text-muted-foreground mt-1 flex items-center gap-1", descriptionClassName)}>
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trendUp ? "text-green-500" : "text-red-500"
                )}
              >
                {trend}
              </span>
            )}
            {description && <span>{description}</span>}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </CardContent>
    </Card>
  );
}
