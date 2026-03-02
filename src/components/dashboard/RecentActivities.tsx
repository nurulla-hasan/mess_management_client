"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/custom/data-table";

export type Activity = {
  id: string;
  date: string;
  user: {
    name: string;
    avatar: string;
    description: string;
    isSystem?: boolean;
  };
  type: string;
  amount: string;
  status: string;
};

const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground text-xs">
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "USER",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {user.description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal text-xs">
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => (
      <div className="font-bold text-sm">{row.getValue("amount")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Completed" || status === "Approved" ? "default" : "outline"}
        >
          {status}
        </Badge>
      );
    },
  },
];

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={activities} />
      </CardContent>
    </Card>
  );
}
