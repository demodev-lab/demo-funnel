"use client";

import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import { Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      data-testid="delete-confirm-dialog"
    >
      <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">수강생 삭제</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-300">정말로 이 수강생을 삭제하시겠습니까?</p>
          <p className="text-sm text-gray-400 mt-2">
            삭제된 데이터는 복구할 수 없습니다.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
