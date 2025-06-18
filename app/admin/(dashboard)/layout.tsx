import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import PageTitle from "@/components/common/PageTitle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "demo-funnel Admin",
  description: "Admin for demo-funnel",
  generator: "v0.dev",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex h-screen bg-[#1A1D29] ${inter.className}`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#1C1F2B] text-white">
        <Header />
        <div className="p-6 space-y-6">
          <PageTitle />
          {children}
        </div>
      </main>
    </div>
  );
}
