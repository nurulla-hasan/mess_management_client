"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface DepositHistoryProps {
  recentDeposits: {
    amount: number;
    date: string;
    paymentMethod: string;
    status: string;
  }[];
}

export function DepositHistory({ recentDeposits }: DepositHistoryProps) {
  return (
    <Card className="h-full border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        {recentDeposits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeposits.map((deposit, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {format(new Date(deposit.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(deposit.amount)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {deposit.paymentMethod.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={deposit.status === "approved" ? "default" : deposit.status === "rejected" ? "destructive" : "secondary"}
                      className={deposit.status === "approved" ? "bg-green-600" : ""}
                    >
                      {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No deposits found for this month.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
