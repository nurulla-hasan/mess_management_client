"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/custom/data-table";
import { Expense } from "@/services/expense";
import { formatCurrency, SuccessToast, ErrorToast } from "@/lib/utils";
import { format } from "date-fns";
import { PaginationMeta } from "@/types/global.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { updateExpenseStatusAction } from "@/actions/expense";

const categoryStyles: Record<string, string> = {
  "meat_fish": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "vegetables": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  "groceries": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "utility": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "other": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
};

interface ExpenseTableProps {
  expenses: Expense[];
  pagination: PaginationMeta;
}

export function ExpenseTable({ expenses, pagination }: ExpenseTableProps) {
  const [data, setData] = useState(expenses);

  // Update local state when props change (e.g. pagination/filtering)
  useEffect(() => {
    setData(expenses);
  }, [expenses]);

  const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    const result = await updateExpenseStatusAction(id, newStatus);
    if (result?.success) {
      SuccessToast(`Expense ${newStatus} successfully`);
      // Optimistic update
      setData(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
    } else {
      ErrorToast(result?.message || "Failed to update status");
    }
  };

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "date",
      header: "DATE",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {format(new Date(row.getValue("date")), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "buyerId",
      header: "BUYER",
      cell: ({ row }) => {
        const buyer = row.original.buyerId?.userId;
        if (!buyer) return <span className="text-sm text-muted-foreground">Unknown</span>;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={buyer.profilePicture} alt={buyer.fullName} />
              <AvatarFallback>
                {buyer.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{buyer.fullName}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "CATEGORY",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        // Format category for display (e.g., "meat_fish" -> "Meat Fish")
        const displayCategory = category
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        return (
          <Badge
            variant="outline"
            className={`font-normal ${categoryStyles[category] || categoryStyles.other}`}
          >
            {displayCategory === "Meat Fish" ? "Meat & Fish" : displayCategory}
          </Badge>
        );
      },
    },
    {
      accessorKey: "items",
      header: "ITEMS",
      cell: ({ row }) => (
        <div className="max-w-50 truncate text-sm text-muted-foreground" title={row.getValue("items")}>
          {row.getValue("items")}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: ({ row }) => (
        <div className="font-bold text-sm">
          {formatCurrency(row.getValue("amount"))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const status = row.original.status || "pending"; // Default to pending if undefined
        return (
          <Badge 
            variant={status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}
            className={status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const expense = row.original;
        // Only show actions if status is pending or we want to allow re-approval/rejection
        // DepositList shows actions unless already approved/rejected (Wait, DepositList logic: if not approved, show approve; if not rejected, show reject)
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {expense.status !== "approved" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(expense._id, "approved")}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Approve
                </DropdownMenuItem>
              )}
              {expense.status !== "rejected" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(expense._id, "rejected")}>
                  <XCircle className="mr-2 h-4 w-4 text-red-600" />
                  Reject
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} meta={pagination} />
      </CardContent>
    </Card>
  );
}
