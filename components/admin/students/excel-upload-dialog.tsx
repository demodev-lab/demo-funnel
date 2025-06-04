"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { read, utils } from "xlsx";
import { ExcelStudent, ExcelUploadProps } from "@/types/excel";
import { toast } from "sonner";

export function ExcelUploadDialog({
  isOpen,
  onOpenChange,
  onSave,
  isProcessing,
  selectedChallengeId,
  challenges,
  validateStudent,
}: ExcelUploadProps) {
  const [excelData, setExcelData] = useState<ExcelStudent[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleExcelFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet) as Record<string, any>[];

      // 데이터 유효성 검사 및 형식 변환
      const processedData: ExcelStudent[] = jsonData.map((row) => {
        const student = {
          name: String(row.name || ""),
          email: String(row.email || ""),
          phone: String(row.phone || ""),
          isValid: true,
          errors: [],
        };

        student.errors = validateStudent(student);
        student.isValid = student.errors.length === 0;

        return student;
      });

      setExcelData(processedData);
    } catch (error) {
      toast.error("엑셀 파일 처리 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleClose = () => {
    setExcelData([]);
    setSelectedFileName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            엑셀 파일 업로드
            {selectedChallengeId && (
              <span className="ml-2 text-sm text-gray-400">
                {challenges.find((c) => c.id === selectedChallengeId)?.name}{" "}
                수강생 추가
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        {!selectedChallengeId ? (
          <div className="py-4 text-yellow-400">
            ⚠️ 먼저 상단에서 챌린지를 선택해주세요.
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="excel-file" className="text-gray-300">
                엑셀 파일 선택
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelFileChange}
                  disabled={isProcessing}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById("excel-file")?.click()}
                  variant="outline"
                  disabled={isProcessing}
                  className="bg-[#1A1D29]/70 border-gray-700/50 text-white hover:bg-[#1A1D29] hover:text-white w-full justify-start"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFileName || "파일을 선택해주세요"}
                </Button>
              </div>
            </div>

            {excelData.length > 0 && (
              <>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700/30">
                        <th className="sticky top-0 px-4 py-2 text-left text-gray-300 bg-[#1A1D29] min-w-[120px] z-10">
                          이름
                        </th>
                        <th className="sticky top-0 px-4 py-2 text-left text-gray-300 bg-[#1A1D29] min-w-[200px] z-10">
                          이메일
                        </th>
                        <th className="sticky top-0 px-4 py-2 text-left text-gray-300 bg-[#1A1D29] min-w-[150px] z-10">
                          전화번호
                        </th>
                        <th className="sticky top-0 px-4 py-2 text-left text-gray-300 bg-[#1A1D29] z-10">
                          비고
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.map((student, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700/30 hover:bg-[#1C1F2B]/50"
                        >
                          <td className="px-4 py-2 text-gray-300 whitespace-nowrap">
                            {student.name}
                          </td>
                          <td className="px-4 py-2 text-gray-400 whitespace-nowrap font-mono text-sm">
                            {student.email}
                          </td>
                          <td className="px-4 py-2 text-gray-400 whitespace-nowrap font-mono text-sm">
                            {student.phone}
                          </td>
                          <td className="px-4 py-2 text-red-400">
                            {!student.isValid && (
                              <div className="max-w-[400px]">
                                <ul className="list-disc list-inside space-y-1">
                                  {student.errors.map((error, idx) => (
                                    <li key={idx} className="text-sm">
                                      {error}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={() => onSave(excelData)}
                    disabled={
                      isProcessing ||
                      !excelData.some((student) => student.isValid)
                    }
                    className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      "유효한 데이터 저장"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
