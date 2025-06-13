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

function getLectureTitle(submissions: any[], index: number) {
  const currentSubmission = submissions[index];
  const sequence = currentSubmission.sequence;

  // 같은 sequence를 가진 강의들을 찾음
  const sameSequenceLectures = submissions.filter(
    (sub) => sub.sequence === sequence,
  );

  // 같은 sequence의 강의가 여러 개일 경우에만 번호를 붙임
  if (sameSequenceLectures.length > 1) {
    // 현재 강의가 같은 sequence 중 몇 번째인지 찾음
    const order =
      sameSequenceLectures.findIndex(
        (sub) =>
          sub.challengeLectureId === currentSubmission.challengeLectureId,
      ) + 1;
    return `${sequence}-${order}강`;
  }

  return `${sequence}강`;
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
          baseData[`${getLectureTitle(student.submissions, idx)} 제출여부`] =
            submission.isSubmitted ? "제출" : "미제출";
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
