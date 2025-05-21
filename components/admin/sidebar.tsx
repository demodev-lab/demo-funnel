"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileText,
  Mail,
  Users,
  LogOut,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/admin/use-media-query";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Close the mobile sidebar when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);

  const navigation = [
    { name: "대시보드", href: "/admin", icon: BarChart3 },
    { name: "수강 정보", href: "/admin/course-info", icon: BookOpen },
    { name: "강의 관리", href: "/admin/lectures", icon: FileText },
    { name: "챌린지 관리", href: "/admin/challenges", icon: Trophy },
    { name: "이메일", href: "/admin/email", icon: Mail },
    { name: "수강생 관리", href: "/admin/students", icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#5046E4]">demo-funnel</h2>
        <p className="text-sm text-gray-500">관리자 백오피스</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-[#DCD9FF] text-[#5046E4]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => !isDesktop && setOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-[#5046E4]" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          로그아웃
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="md:hidden">
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
