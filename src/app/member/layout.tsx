import React from "react";
import { MemberHeader } from "@/components/layout/member-header";
import { getCurrentUser } from "@/services/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="flex h-screen mx-auto container flex-col bg-card">
      <MemberHeader user={user} />
      <ScrollArea className="flex-1 p-4 md:p-6">{children}</ScrollArea>
    </div>
  );
}
