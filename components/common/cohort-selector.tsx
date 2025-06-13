"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

export type CohortSelectorProps = {
  challenges: {
    id: number | string;
    name: string;
    start_date?: string;
    end_date?: string;
  }[];
  selectedChallengeId: string;
  onChange: (id: string) => void;
};

export default function CohortSelector({
  challenges,
  selectedChallengeId,
  onChange,
}: CohortSelectorProps) {
  const selectedChallenge = challenges.find(
    (c) => String(c.id) === selectedChallengeId,
  );

  const start = selectedChallenge?.start_date
    ? new Date(selectedChallenge.start_date)
    : null;
  const end = selectedChallenge?.end_date
    ? new Date(selectedChallenge.end_date)
    : null;

  return (
    <div className="flex items-center gap-2 bg-[#252A3C] px-3 rounded-lg border border-gray-700/30">
      <div className="text-white font-semibold text-sm">현재 기수</div>
      <Select value={selectedChallengeId} onValueChange={onChange}>
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

      {start && end && (
        <div className="hidden md:flex items-center text-sm text-gray-400 px-3 py-1.5">
          <Calendar className="h-4 w-4 mr-2 text-[#8C7DFF]" />
          <span>
            {start.getMonth() + 1}월 {start.getDate()}일 ~ {end.getMonth() + 1}
            월 {end.getDate()}일
          </span>
        </div>
      )}
    </div>
  );
}
