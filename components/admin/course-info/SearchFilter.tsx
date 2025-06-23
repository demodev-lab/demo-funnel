"use client";

import { Download, Search } from "lucide-react";
import { Input } from "@/components/common/input";
import { Switch } from "@/components/common/switch";
import { Label } from "@/components/common/label";
import { Button } from "@/components/common/button";
import { useExportToExcel } from "@/hooks/admin/useExportToExcel";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface SearchFilterProps {
  searchQuery: string;
  showCompletedOnly: boolean;
}

export default function SearchFilter({
  searchQuery,
  showCompletedOnly,
}: SearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const { exportToExcel, isExporting } = useExportToExcel({
    searchQuery,
    showCompletedOnly,
  });

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const updateSearchParams = useCallback(
    (key: string, value: string | boolean) => {
      const params = new URLSearchParams(window.location.search);

      if (value === "" || value === false) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.push(newUrl);
    },
    [pathname, router],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        updateSearchParams("search", localSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, searchQuery, updateSearchParams]);

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  const handleCompletedChange = (value: boolean) => {
    updateSearchParams("completed", value);
  };

  return (
    <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="이름 또는 이메일로 검색"
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-[#1A1D29] border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="completed-filter"
              checked={showCompletedOnly}
              onCheckedChange={handleCompletedChange}
              className="data-[state=checked]:bg-[#8C7DFF]"
            />
            <Label htmlFor="completed-filter" className="text-gray-300">
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
