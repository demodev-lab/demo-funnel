"use client";

import { useState, useEffect } from "react";
import { Menu, Calendar } from "lucide-react";
import { Button } from "@/components/common/button";
import { Sheet, SheetTrigger } from "@/components/common/sheet";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/apis/challenges";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import CohortSelector from "@/components/common/cohort-selector";

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
  const { selectedChallengeId, setSelectedChallengeId } = useChallengeStore();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (challenges.length > 0 && !selectedChallengeId) {
      const firstChallenge = challenges[0];
      setSelectedChallengeId(firstChallenge.id);
      setSelectedCohort({
        id: String(firstChallenge.id),
        name: firstChallenge.name,
        startDate: new Date(firstChallenge.openDate || Date.now()),
        endDate: new Date(firstChallenge.closeDate || Date.now()),
      });
    }
  }, [challenges, selectedChallengeId, setSelectedChallengeId]);

  useEffect(() => {
    if (selectedChallengeId && challenges.length > 0) {
      const challenge = challenges.find((c) => c.id === selectedChallengeId);
      if (challenge) {
        setSelectedCohort({
          id: String(challenge.id),
          name: challenge.name,
          startDate: new Date(challenge.openDate || Date.now()),
          endDate: new Date(challenge.closeDate || Date.now()),
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
    <header className="border-b border-gray-700/30 bg-[#1A1D29]/90 backdrop-blur-sm py-4 px-6 h-[74px]">
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
              <CohortSelector
                challengeList={challenges}
                value={String(selectedChallengeId)}
                onValueChange={(value) => {
                  setSelectedChallengeId(Number(value));
                  const challenge = challenges.find(
                    (c) => String(c.id) === value,
                  );
                  if (challenge) {
                    setSelectedCohort({
                      id: String(challenge.id),
                      name: challenge.name,
                      startDate: new Date(challenge.openDate || Date.now()),
                      endDate: new Date(challenge.closeDate || Date.now()),
                    });
                  }
                }}
              />

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
      </div>
    </header>
  );
}
