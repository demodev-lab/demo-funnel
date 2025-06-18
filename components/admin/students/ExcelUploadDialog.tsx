"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/Dialog";
import { Loader2, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { Student } from "@/types/user";
import { toast } from "sonner";

interface ExcelUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (validStudents: Student[]) => Promise<void>;
  isProcessing: boolean;
  selectedChallengeId: number;
  challenges: any[];
}

export default function ExcelUploadDialog({
  isOpen,
  onOpenChange,
  onSave,
  isProcessing,
  selectedChallengeId,
  challenges,
}: ExcelUploadDialogProps) {
  const [previewData, setPreviewData] = useState<Student[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateExcelData = (data: any[]): Student[] => {
    return data
      .filter((row) => row.name && row.email && row.phone)
      .map((row) => ({
        name: String(row.name || "").trim(),
        email: String(row.email || "").trim(),
        phone: String(row.phone || "").trim(),
      }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedChallengeId) {
      toast.error("챌린지를 선택해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validStudents = validateExcelData(jsonData);
        setPreviewData(validStudents);

        if (validStudents.length === 0) {
          toast.error("유효한 데이터가 없습니다.");
        }
      } catch (error) {
        console.error("엑셀 파일 처리 중 오류 발생:", error);
        toast.error("엑셀 파일 처리 중 오류가 발생했습니다.");
      }
    };

    reader.onerror = () => {
      toast.error("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsBinaryString(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (previewData.length === 0) {
      toast.error("저장할 데이터가 없습니다.");
      return;
    }

    await onSave(previewData);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#252A3C] border-gray-700/30 text-white">
        <DialogHeader>
          <DialogTitle>엑셀 파일 업로드</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="w-full border-dashed border-2 border-gray-700/50 bg-[#1A1D29]/70 text-gray-300 hover:bg-[#1A1D29]/90 hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            엑셀 파일 선택
          </Button>

          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                {previewData.length}개의 데이터가 확인되었습니다.
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#1A1D29]/70 text-gray-300">
                      <th className="p-2 text-left">이름</th>
                      <th className="p-2 text-left">이메일</th>
                      <th className="p-2 text-left">전화번호</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((student, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700/30 hover:bg-[#1A1D29]/30"
                      >
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.email}</td>
                        <td className="p-2">{student.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                onClick={handleSave}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "저장하기"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
