"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/apis/challenges";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentChallengeId = pathname.split("/").pop();

  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  return (
    <header className="border-b border-gray-700/30 bg-[#1A1D29]/90 backdrop-blur-sm py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#252A3C] px-3 rounded-lg border border-gray-700/30">
                  <div className="text-white font-semibold text-sm">
                    현재 기수
                  </div>
                  <Select
                    value={currentChallengeId}
                    onValueChange={(value) => {
                      router.push(`/class/${value}`);
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
