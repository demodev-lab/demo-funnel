"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserChallenges } from '@/types/challenge';
import { useRouter, usePathname } from "next/navigation";

export default function Header({ challengeList }: { challengeList: UserChallenges[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentChallengeId = pathname.split("/").pop();

  return (
    <header className="py-4 w-full flex justify-end pr-4">
      <div className="flex items-center gap-2 bg-[#252A3C] px-3 rounded-lg border border-gray-700/30">
        <div className="text-white font-semibold text-sm">현재 기수</div>
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
            {challengeList.map((challenge) => (
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
    </header>
  );
}
