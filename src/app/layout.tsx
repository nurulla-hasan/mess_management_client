import type { Metadata } from "next";
import { Poppins, Geist_Mono } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const poppins_display = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
});
const poppins_body = Poppins({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--body-family',
});
const geist_mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Mess Management System",
  description: "Efficiently manage your mess meals, expenses, and members.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins_display.variable} ${poppins_body.variable} ${geist_mono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
