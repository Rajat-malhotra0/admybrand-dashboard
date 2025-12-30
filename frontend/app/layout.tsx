import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ADmyBRAND Insights - Digital Marketing Analytics Dashboard",
  description: "Comprehensive analytics platform for digital marketing agencies. Track campaigns, analyze performance, and optimize strategies with ADmyBRAND Insights.",
}
import { DashboardDataProvider } from "@/contexts/DashboardDataContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <DashboardDataProvider>
            {children}
            <Toaster />
          </DashboardDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
