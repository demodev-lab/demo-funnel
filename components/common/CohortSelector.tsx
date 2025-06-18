"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";

interface Challenge {
  id: number;
  name: string;
}

interface CohortSelectorProps {
  challengeList: Challenge[];
  value: string;
  onValueChange: (value: string) => void;
}

export default function CohortSelector({
  challengeList,
  value,
  onValueChange,
}: CohortSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-[#252A3C] px-3 rounded-lg border border-gray-700/30">
      <div className="text-white font-semibold text-sm">현재 기수</div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[120px] border-0 bg-transparent focus:outline-none focus:ring-0 text-white truncate overflow-hidden whitespace-nowrap">
          <div className="w-full truncate">
            <SelectValue
              placeholder="기수 선택"
              className="pointer-events-none select-none truncate"
            />
          </div>
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
  );
}
