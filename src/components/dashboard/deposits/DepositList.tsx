/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/custom/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { updateDepositStatusAction } from "@/actions/deposit";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

// Define type based on API response
type Deposit = {
  _id: string;
  memberId: {
    _id: string;
    userId: {
      fullName: string;
      email: string;
      profilePicture?: string;
    };
  };
  amount: number;
  paymentMethod: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
  verifiedBy?: any;
};

interface DepositListProps {
  initialData: Deposit[];
  pagination: any;
}

export function DepositList({ initialData, pagination }: DepositListProps) {
  const [data, setData] = useState(initialData);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const result = await updateDepositStatusAction(id, newStatus);
    if (result?.success) {
      SuccessToast(`Deposit ${newStatus} successfully`);
      // Optimistic update
      setData(prev => prev.map(d => d._id === id ? { ...d, status: newStatus as any } : d));
    } else {
      ErrorToast(result?.message || "Failed to update status");
    }
  };

  const columns: ColumnDef<Deposit>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm">{format(new Date(row.original.date), "MMM dd, yyyy")}</div>
      ),
    },
    {
      id: "member",
      accessorFn: (row) => row.memberId?.userId?.fullName || "Unknown",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original.memberId?.userId;
        if (!member) return <span className="text-muted-foreground">Unknown</span>;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.profilePicture} alt={member.fullName} />
              <AvatarFallback>{member.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{member.fullName}</span>
              <span className="text-xs text-muted-foreground">{member.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-bold text-sm">{formatCurrency(row.original.amount)}</div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => (
        <div className="capitalize text-sm">{row.original.paymentMethod.replace("_", " ")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant = "default";
        if (status === "pending") variant = "secondary";
        else if (status === "approved") variant = "default"; 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        else if (status === "rejected") variant = "destructive";
        
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
        const deposit = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {deposit.status !== "approved" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(deposit._id, "approved")}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Approve
                </DropdownMenuItem>
              )}
              {deposit.status !== "rejected" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(deposit._id, "rejected")}>
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
    <DataTable 
      columns={columns} 
      data={data} 
      searchKey="member"
      meta={pagination}
    />
  );
}
