import React from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <ScrollArea className="flex-1 p-4 min-h-[calc(100vh-64px)]">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
