"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface DashboardHeaderProps {
  user?: {
    fullName: string;
    profilePicture?: string;
    role?: string;
  };
  month: string;
}

export function DashboardHeader({ user, month }: DashboardHeaderProps) {
  const currentDate = format(new Date(), "EEEE, MMMM dd, yyyy");

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
          <AvatarFallback className="text-xl bg-primary/10 text-primary">
            {user?.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            {month} • {user?.role === "admin" ? "Admin" : "Member"} Dashboard
          </p>
        </div>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-sm font-medium">Today is</p>
        <p className="text-lg font-semibold">{currentDate}</p>
      </div>
    </div>
  );
}
