"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu } from "lucide-react";
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

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
        </Sheet>

        <div className="ml-2 flex items-center gap-2">
          <Select
            value={selectedCohort.id}
            onValueChange={(value) => {
              const cohort = COHORT_DATA.find((c) => c.id === value);
              if (cohort) setSelectedCohort(cohort);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="기수 선택" />
            </SelectTrigger>
            <SelectContent>
              {COHORT_DATA.map((cohort) => (
                <SelectItem key={cohort.id} value={cohort.id}>
                  {cohort.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-500 ml-1">
            {selectedCohort.startDate.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}{" "}
            ~
            {selectedCohort.endDate.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">관리자</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>프로필 설정</DropdownMenuItem>
          <DropdownMenuItem>로그아웃</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
