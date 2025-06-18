import { Button } from "@/components/common/button";
import { Loader2 } from "lucide-react";

interface DeleteDialogContentProps {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteDialogContent({
  onCancel,
  onConfirm,
  isDeleting,
}: DeleteDialogContentProps) {
  return (
    <div>
      <div className="py-4">
        <p>정말로 이 수강생을 삭제하시겠습니까?</p>
        <p className="text-sm text-gray-500 mt-2">
          삭제된 데이터는 복구할 수 없습니다.
        </p>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          취소
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          삭제
        </Button>
      </div>
    </div>
  );
}
