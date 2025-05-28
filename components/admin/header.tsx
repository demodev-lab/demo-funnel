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
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/admin/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/apis/challenges";
import { useChallengeStore } from "@/lib/store/useChallengeStore";

// 기수와 날짜 정보를 담은 타입 정의
type CohortInfo = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

export default function Header() {
  const pathname = usePathname();
  const showCohortSelector = !pathname?.includes("/admin/challenges");

  const { data: challenges = [], isLoading: isLoadingChallenges } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  const [selectedCohort, setSelectedCohort] = useState<CohortInfo | null>(null);
  console.log(selectedCohort);
  const { selectedChallengeId, setSelectedChallengeId } = useChallengeStore();
  const [userName, setUserName] = useState<string>("");
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (challenges.length > 0 && !selectedChallengeId) {
      const firstChallenge = challenges[0];
      setSelectedChallengeId(String(firstChallenge.id));
      setSelectedCohort({
        id: String(firstChallenge.id),
        name: firstChallenge.name,
        startDate: new Date(firstChallenge.start_date || Date.now()),
        endDate: new Date(firstChallenge.end_date || Date.now()),
      });
    }
  }, [challenges, selectedChallengeId, setSelectedChallengeId]);

  useEffect(() => {
    if (selectedChallengeId && challenges.length > 0) {
      const challenge = challenges.find(
        (c) => String(c.id) === selectedChallengeId,
      );
      console.log(challenge, "여기여");
      if (challenge) {
        setSelectedCohort({
          id: String(challenge.id),
          name: challenge.name,
          startDate: new Date(challenge.open_date || Date.now()),
          endDate: new Date(challenge.close_date || Date.now()),
        });
      }
    }
  }, [selectedChallengeId, challenges]);

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

  if (isLoadingChallenges) {
    return (
      <header className="border-b border-gray-700/30 bg-[#1A1D29]/90 backdrop-blur-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse bg-gray-700/30 h-8 w-32 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-700/30 bg-[#1A1D29]/90 backdrop-blur-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:bg-[#252A3C] hover:text-white"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          {showCohortSelector && selectedCohort && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#252A3C]  px-3 rounded-lg border border-gray-700/30">
                <div className="text-white font-semibold text-sm">
                  현재 기수
                </div>
                <Select
                  value={selectedChallengeId}
                  onValueChange={(value) => {
                    setSelectedChallengeId(value);
                    const challenge = challenges.find(
                      (c) => String(c.id) === value,
                    );
                    if (challenge) {
                      setSelectedCohort({
                        id: String(challenge.id),
                        name: challenge.name,
                        startDate: new Date(challenge.start_date || Date.now()),
                        endDate: new Date(challenge.end_date || Date.now()),
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-[120px] border-0 bg-transparent focus:ring-0 text-white">
                    <SelectValue placeholder="기수 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#252A3C] border border-gray-700/50 text-white min-w-[160px]">
                    {challenges.map((challenge) => (
                      <SelectItem
                        key={String(challenge.id)}
                        value={String(challenge.id)}
                        className="hover:bg-[#1C1F2B] text-white"
                      >
                        {challenge.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:flex items-center text-sm text-gray-400 px-3 py-1.5 ">
                <Calendar className="h-4 w-4 mr-2 text-[#8C7DFF]" />
                <span>
                  {selectedCohort.startDate.getMonth() + 1}월{" "}
                  {selectedCohort.startDate.getDate()}일 ~{" "}
                  {selectedCohort.endDate.getMonth() + 1}월{" "}
                  {selectedCohort.endDate.getDate()}일
                </span>
              </div>
            </div>
          )}
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
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-300 hover:bg-[#252A3C] hover:text-white"
              >
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
            <DropdownMenuContent
              align="end"
              className="bg-[#252A3C] border border-gray-700/50 text-white"
            >
              <DropdownMenuLabel className="text-gray-400">
                내 계정
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700/30" />
              <DropdownMenuItem className="hover:bg-[#1C1F2B] focus:bg-[#1C1F2B] cursor-pointer">
                프로필 설정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
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
