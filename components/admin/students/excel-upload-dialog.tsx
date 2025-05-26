import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { type Student } from "@/hooks/useStudents";

interface ExcelUploadDialogContentProps {
  parsedStudents: Array<Omit<Student, "id">>;
  isUploading: boolean;
  isAdding: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onConfirm: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function ExcelUploadDialogContent({
  parsedStudents,
  isUploading,
  isAdding,
  onFileChange,
  onCancel,
  onConfirm,
  fileInputRef,
}: ExcelUploadDialogContentProps) {
  return (
    <div className="py-4">
      {parsedStudents.length === 0 ? (
        <>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={onFileChange}
            disabled={isUploading}
            ref={fileInputRef}
          />
          {isUploading && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              업로드 중...
            </div>
          )}
        </>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto border rounded mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-1 text-left">이름</th>
                  <th className="px-2 py-1 text-left">이메일</th>
                  <th className="px-2 py-1 text-left">전화번호</th>
                </tr>
              </thead>
              <tbody>
                {parsedStudents.map((s, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-2 py-1">{s.name}</td>
                    <td className="px-2 py-1">{s.email}</td>
                    <td className="px-2 py-1">{s.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={isAdding}>
              취소
            </Button>
            <Button
              className="bg-[#5046E4] hover:bg-[#4038c7]"
              onClick={onConfirm}
              disabled={isAdding}
            >
              {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              확인
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
