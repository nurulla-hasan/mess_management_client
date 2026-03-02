"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Utensils,
  Wallet,
  FileText,
  Settings,
  User,
  LogOut,
  CreditCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logOut } from "@/services/auth";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: Users,
  },
  {
    title: "Meals",
    href: "/dashboard/meals",
    icon: Utensils,
  },
  {
    title: "Deposits",
    href: "/dashboard/deposits",
    icon: CreditCard,
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: Wallet,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logOut();
    if (result?.success) {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white">
            <Utensils className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">Mess Manager</span>
            <span className="text-xs text-muted-foreground">Admin Console</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out group overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 rounded-r-full bg-primary-foreground/50" />
                )}
                <item.icon className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110")} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className="h-9 w-9 border bg-orange-200">
            <AvatarImage src="/avatars/admin.png" alt="Admin" />
            <AvatarFallback className="bg-orange-200 text-orange-700">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">Admin User</span>
            <span className="truncate text-xs text-muted-foreground">Manager</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-5 w-5 text-muted-foreground hover:text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="hidden h-screen w-64 border-r md:flex">
      <SidebarContent />
    </div>
  );
}
