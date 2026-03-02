"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/custom/data-table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "@/services/member";
import { PaginationMeta } from "@/types/global.types";
import { format } from "date-fns";

import { updateMemberStatusAction } from "@/actions/member";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { EditMemberModal } from "./EditMemberModal";

const StatusCell = ({ initialStatus, memberId }: { initialStatus: string, memberId: string }) => {
  const [isActive, setIsActive] = useState(initialStatus === "active");
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    
    const newStatus = !isActive ? "active" : "inactive";
    // Optimistic update
    setIsActive(!isActive);

    try {
        const result = await updateMemberStatusAction(memberId, newStatus);
        if (!result?.success) {
            // Revert
            setIsActive(isActive);
            ErrorToast(result?.message || "Failed to update status");
        } else {
            SuccessToast(`Member is now ${newStatus}`);
        }
    } catch {
        setIsActive(isActive);
        ErrorToast("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        role="switch"
        aria-checked={isActive}
        onClick={handleToggle}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isActive ? "bg-green-500" : "bg-input",
          loading && "opacity-50 cursor-wait"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            isActive ? "translate-x-4" : "translate-x-0",
          )}
        />
      </div>
      <span className="text-sm text-muted-foreground capitalize">
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

const columns: ColumnDef<Member>[] = [
  {
    accessorFn: (row) => row.userId?.fullName || "Unknown",
    id: "name",
    header: "NAME",
    cell: ({ row }) => {
      const member = row.original;
      const user = member.userId;

      if (!user) {
        return (
          <div className="flex items-center gap-3">
             <Avatar className="h-10 w-10">
              <AvatarFallback>??</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-red-500">Unknown User</span>
              <span className="text-xs text-muted-foreground">ID: {member._id}</span>
            </div>
          </div>
        )
      }

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture} alt={user.fullName} />
            <AvatarFallback>
              {user.fullName?.substring(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.fullName}</span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId?.phone || "N/A",
    id: "phone",
    header: "PHONE",
    cell: ({ row }) => <div className="text-sm">{row.original.userId?.phone || "N/A"}</div>,
  },
  {
    accessorFn: (row) => row.userId?.email || "N/A",
    id: "email",
    header: "EMAIL",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.userId?.email || "N/A"}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.userId?.role || "member",
    id: "role",
    header: "ROLE",
    cell: ({ row }) => (
      <Badge
        variant={row.original.userId?.role === "admin" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.original.userId?.role || "Member"}
      </Badge>
    ),
  },
  {
    accessorFn: (row) => row.userId?.joinDate,
    id: "joinDate",
    header: "JOIN DATE",
    cell: ({ row }) => {
      const date = row.original.userId?.joinDate;
      return (
        <div className="text-sm">
          {date ? format(new Date(date), "MMM dd, yyyy") : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusCell initialStatus={row.original.status} memberId={row.original._id} />,
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <EditMemberModal member={row.original} />,
  },
];

interface MemberTableProps {
  members: Member[];
  pagination: PaginationMeta;
}

export function MemberTable({ members, pagination }: MemberTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={members} meta={pagination} />
      </CardContent>
    </Card>
  );
}
