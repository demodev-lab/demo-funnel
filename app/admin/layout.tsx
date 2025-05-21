import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/admin/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "demo-funnel Admin",
  description: "Admin for demo-funnel",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-auto">
              <div className="p-4 md:p-6">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
