import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showUnsubmittedOnly: boolean;
  onUnsubmittedChange: (value: boolean) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  showUnsubmittedOnly,
  onUnsubmittedChange,
}: SearchFilterProps) {
  return (
    <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden p-5 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <Label htmlFor="search" className="text-gray-300">
            수강생 검색
          </Label>
          <Input
            id="search"
            placeholder="이름 또는 이메일 검색"
            className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-unsubmitted"
            checked={showUnsubmittedOnly}
            onCheckedChange={onUnsubmittedChange}
          />
          <Label htmlFor="show-unsubmitted" className="text-gray-300">
            미제출자만 보기
          </Label>
        </div>
      </div>
    </div>
  );
}
