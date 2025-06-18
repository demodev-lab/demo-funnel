import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Switch } from "@/components/common/switch";
import { Button } from "@/components/common/Button";
import { Download } from "lucide-react";
import { useExportToExcel } from "@/hooks/admin/useExportToExcel";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showCompletedOnly: boolean;
  onCompletedChange: (value: boolean) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  showCompletedOnly,
  onCompletedChange,
}: SearchFilterProps) {
  const { exportToExcel, isExporting } = useExportToExcel({
    searchQuery,
    showCompletedOnly,
  });

  return (
    <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden p-5 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
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
              id="show-completed"
              checked={showCompletedOnly}
              onCheckedChange={onCompletedChange}
            />
            <Label htmlFor="show-completed" className="text-gray-300">
              과제 완료자만 보기
            </Label>
          </div>
        </div>

        <Button
          onClick={exportToExcel}
          disabled={isExporting}
          className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white min-w-[140px]"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              내보내는 중...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              엑셀로 내보내기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
