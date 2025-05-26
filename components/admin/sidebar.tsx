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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/admin/use-media-query";
import { useAuth } from "@/hooks/admin/useAuth";

export default function Sidebar() {
  const { logout } = useAuth();
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
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1A1D29] to-[#252A3C] text-white">
      <div className="p-6 border-b border-gray-700/30">
        <h2 className="text-xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
            demo-funnel
          </span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">관리자 백오피스</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-[#5046E4]/10 text-[#8C7DFF] border-l-2 border-[#8C7DFF]"
                    : "text-gray-300 hover:bg-[#1C1F2B] hover:text-white"
                }`}
                onClick={() => !isDesktop && setOpen(false)}
              >
                <div className="flex items-center">
                  <div
                    className={`mr-3 p-1 rounded-md ${
                      isActive
                        ? "bg-[#5046E4]/10"
                        : "bg-transparent group-hover:bg-[#1C1F2B]/50"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-[#8C7DFF]"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    />
                  </div>
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-[#8C7DFF] opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700/30 mt-auto">
        <button
          onClick={logout}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-[#1C1F2B] hover:text-white transition-colors duration-200 group"
        >
          <div className="flex items-center">
            <div className="mr-3 p-1 rounded-md bg-transparent group-hover:bg-[#1C1F2B]/50">
              <LogOut className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
            </div>
            <span>로그아웃</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 border-r border-gray-700/30 shadow-lg h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-[#1C1F2B]/70"
          >
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-64 border-r border-gray-700/30 shadow-lg"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
