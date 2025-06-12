import { useState } from "react";
import { utils, writeFile } from "xlsx";
import { getStudentSubmissions } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { toast } from "sonner";

interface UseExportToExcelProps {
  searchQuery: string;
  showCompletedOnly: boolean;
}

interface ExportData {
  번호: number;
  이름: string;
  이메일: string;
  [key: string]: string | number | boolean;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useExportToExcel({
  searchQuery,
  showCompletedOnly,
}: UseExportToExcelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { selectedChallengeId } = useChallengeStore();

  const exportToExcel = async () => {
    if (!selectedChallengeId) {
      toast.error("선택된 과정이 없습니다.");
      return;
    }

    try {
      setIsExporting(true);

      // 전체 데이터 조회 (페이지네이션 없이)
      const response = await getStudentSubmissions(
        selectedChallengeId,
        0,
        1000,
        showCompletedOnly,
      );

      if (!response.data || response.data.length === 0) {
        toast.error("내보낼 데이터가 없습니다.");
        return;
      }

      // 검색어 필터링
      const filteredData = response.data.filter((student) => {
        const searchMatch =
          searchQuery.toLowerCase().trim() === "" ||
          student.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch;
      });

      // 엑셀 데이터 포맷팅
      const exportData: ExportData[] = filteredData.map((student, index) => {
        const baseData = {
          번호: index + 1,
          이름: student.userName,
          이메일: student.userEmail,
        };

        // 각 강의별 제출 상태 추가
        student.submissions.forEach((submission, idx) => {
          baseData[`${idx + 1}강 제출여부`] = submission.isSubmitted
            ? "제출"
            : "미제출";
        });

        return baseData;
      });

      // 워크시트 생성
      const worksheet = utils.json_to_sheet(exportData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "수강정보");

      // 파일 저장
      const now = new Date();
      const fileName = `수강정보_${formatDate(now).replace(/-/g, "")}.xlsx`;
      writeFile(workbook, fileName);

      toast.success("엑셀 파일이 생성되었습니다.");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("엑셀 파일 생성에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToExcel,
    isExporting,
  };
}
