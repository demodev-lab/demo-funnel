"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

// 기수와 날짜 정보를 담은 타입 정의
type CohortInfo = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

// TODO 상수 파일 분리 '필'
const COHORT_DATA: CohortInfo[] = [
  {
    id: "1",
    name: "1기",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 5),
  },
  {
    id: "2",
    name: "2기",
    startDate: new Date(2025, 0, 6),
    endDate: new Date(2025, 0, 10),
  },
  {
    id: "3",
    name: "3기",
    startDate: new Date(2025, 0, 11),
    endDate: new Date(2025, 0, 15),
  },
];

export default function Header() {
  const [selectedCohort, setSelectedCohort] = useState<CohortInfo>(
    COHORT_DATA[0],
  );
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      if (user) {
        setUserName(user.user_metadata.user_name || user.email || "관리자");
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header className="border-b border-gray-700/30 bg-[#1A1D29]/90 backdrop-blur-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:bg-[#252A3C] hover:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#252A3C] p-1.5 pr-3 rounded-lg border border-gray-700/30">
              <Badge className="bg-[#5046E4] text-white font-semibold hover:bg-[#6A5AFF]">
                현재 기수
              </Badge>
              <Select
                value={selectedCohort.id}
                onValueChange={(value) => {
                  const cohort = COHORT_DATA.find((c) => c.id === value);
                  if (cohort) setSelectedCohort(cohort);
                }}
              >
                <SelectTrigger className="w-[90px] border-0 bg-transparent focus:ring-0 text-white">
                  <SelectValue placeholder="기수 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#252A3C] border border-gray-700/50 text-white">
                  {COHORT_DATA.map((cohort) => (
                    <SelectItem key={cohort.id} value={cohort.id} className="hover:bg-[#1C1F2B] focus:bg-[#1C1F2B] text-gray-300 hover:text-white">
                      {cohort.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex items-center text-sm text-gray-400 bg-[#252A3C] px-3 py-1.5 rounded-lg border border-gray-700/30">
              <Calendar className="h-4 w-4 mr-2 text-[#8C7DFF]" />
              <span>
                {selectedCohort.startDate.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                ~{" "}
                {selectedCohort.endDate.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-300 hover:bg-[#252A3C] hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#5046E4]"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-gray-300 hover:bg-[#252A3C] hover:text-white">
                <Avatar className="h-8 w-8 border border-gray-700/50">
                  <AvatarImage src="/placeholder.svg" alt={userName} />
                  <AvatarFallback className="bg-[#5046E4]/10 text-[#8C7DFF]">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">관리자</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#252A3C] border border-gray-700/50 text-white">
              <DropdownMenuLabel className="text-gray-400">내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700/30" />
              <DropdownMenuItem className="hover:bg-[#1C1F2B] focus:bg-[#1C1F2B] cursor-pointer">
                프로필 설정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-[#1C1F2B] focus:bg-[#1C1F2B] text-red-400 cursor-pointer"
              >
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
