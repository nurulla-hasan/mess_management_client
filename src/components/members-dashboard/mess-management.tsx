"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MakeDepositModal } from "./make-deposit-modal";
import { RequestExpenseModal } from "./request-expense-modal";

export function MessManagement() {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <MakeDepositModal />
        <RequestExpenseModal />
      </CardContent>
    </Card>
  );
}
