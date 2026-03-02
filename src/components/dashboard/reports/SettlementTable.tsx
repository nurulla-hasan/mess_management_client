
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/custom/data-table";
import { MemberSettlement, SettlementTotals } from "@/services/report";
import { ColumnDef } from "@tanstack/react-table";

interface SettlementTableProps {
  settlement: MemberSettlement[];
  totals: SettlementTotals;
}

export function SettlementTable({ settlement, totals }: SettlementTableProps) {
  
  const columns: ColumnDef<MemberSettlement>[] = [
    {
      accessorKey: "memberName",
      header: "Member Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.profilePicture} />
            <AvatarFallback>{row.original.memberName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{row.original.memberName}</span>
        </div>
      ),
      footer: () => <div className="font-bold pl-2">Total</div>,
    },
    {
      accessorKey: "meals",
      header: "Meals",
      footer: () => <div className="font-bold">{totals.totalMeals}</div>,
    },
    {
      accessorKey: "mealCost",
      header: "Meal Cost",
      cell: ({ row }) => `৳${row.original.mealCost.toLocaleString()}`,
      footer: () => <div className="font-bold">৳{totals.totalMealCost.toLocaleString()}</div>,
    },
    {
      accessorKey: "fixedShare",
      header: "Fixed Share",
      cell: ({ row }) => `৳${row.original.fixedShare.toLocaleString()}`,
      footer: () => <div className="font-bold">৳{totals.totalFixedShare.toLocaleString()}</div>,
    },
    {
      accessorKey: "totalLiability",
      header: "Total Liability",
      cell: ({ row }) => `৳${row.original.totalLiability.toLocaleString()}`,
      footer: () => <div className="font-bold">৳{totals.totalLiability.toLocaleString()}</div>,
    },
    {
      accessorKey: "deposited",
      header: "Deposited",
      cell: ({ row }) => `৳${row.original.deposited.toLocaleString()}`,
      footer: () => <div className="font-bold">৳{totals.totalDeposited.toLocaleString()}</div>,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const balance = row.original.balance;
        return (
          <span className={balance < 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
            {balance < 0 ? `(৳${Math.abs(balance).toLocaleString()})` : `৳${balance.toLocaleString()}`}
          </span>
        );
      },
      footer: () => {
        const balance = totals.totalBalance;
        return (
          <div className={balance < 0 ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
             {balance < 0 ? `(৳${Math.abs(balance).toLocaleString()})` : `৳${balance.toLocaleString()}`}
          </div>
        );
      },
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Settlement Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={settlement} 
        />
      </CardContent>
    </Card>
  );
}
