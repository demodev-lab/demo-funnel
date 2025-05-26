import { Button } from "@/components/ui/button";
import { Plus, Upload, Loader2 } from "lucide-react";

interface StudentListStateProps {
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function StudentListState({
  isLoading,
  error,
  onRetry,
}: StudentListStateProps) {
  const content = isLoading ? (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      <span className="ml-2 text-gray-500">학생 목록을 불러오는 중...</span>
    </div>
  ) : error ? (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="text-red-500 mb-2">오류가 발생했습니다</div>
      <div className="text-gray-500 text-sm mb-4">
        {error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."}
      </div>
      <Button onClick={onRetry} variant="outline">
        페이지 새로고침
      </Button>
    </div>
  ) : null;

  return (
    <div className="space-y-4">
      <div className="py-4 flex justify-end">
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Upload className="w-4 h-4 mr-2" />
            엑셀 파일 업로드
          </Button>
          <Button
            size="sm"
            className="bg-[#5046E4] hover:bg-[#4038c7]"
            disabled
          >
            <Plus className="w-4 h-4 mr-2" />
            수강생 추가
          </Button>
        </div>
      </div>
      <div className="border rounded-xl overflow-hidden">{content}</div>
    </div>
  );
}
