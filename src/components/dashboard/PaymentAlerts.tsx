import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Info } from "lucide-react";

export interface PaymentAlert {
  id: string;
  name: string;
  avatar: string;
  amount: string;
}

interface PaymentAlertsProps {
  alerts: PaymentAlert[];
}

export function PaymentAlerts({ alerts }: PaymentAlertsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Alerts</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
             <div className="text-center text-sm text-muted-foreground py-4">No payment alerts</div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={alert.avatar} alt={alert.name} />
                    <AvatarFallback>
                      {alert.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{alert.name}</p>
                    <p className="text-xs text-red-500 font-medium">
                      Owes {alert.amount}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {Number(alert.amount.replace(/[^0-9]/g, "")) > 1000
                    ? "Remind"
                    : "Details"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-green-50 p-4 text-green-900 dark:bg-green-900/20 dark:text-green-300">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400" />
          <div>
            <h4 className="font-medium mb-1">Settlement Period Ends Soon</h4>
            <p className="text-sm opacity-90">
              Current cycle ends in 3 days. Send reminders to all members with
              pending dues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
