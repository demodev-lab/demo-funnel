import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { StudentSubmission, SubmissionStatus } from "@/types/user";

interface StudentTableProps {
  students: StudentSubmission[];
  onSubmissionClick: (
    submission: StudentSubmission,
    lectureIndex: number,
  ) => void;
}

const getLectureTitle = (submissions: SubmissionStatus[], index: number) => {
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
    return `${sequence}-${order} 강`;
  }

  return `${sequence} 강`;
};

export function StudentTable({
  students,
  onSubmissionClick,
}: StudentTableProps) {
  return (
    <div className="flex divide-x divide-gray-700/30">
      {/* 고정 영역 */}
      <div className="flex-1 bg-[#252A3C]">
        <Table>
          <TableHeader className="bg-[#1A1D29]">
            <TableRow className="hover:bg-transparent border-b border-gray-700/30">
              <TableHead className="w-[60px] bg-[#1A1D29] h-[58px] px-4">
                No.
              </TableHead>
              <TableHead className="bg-[#1A1D29] h-[58px] px-4">
                수강생 이름
              </TableHead>
              <TableHead className="bg-[#1A1D29] h-[58px] px-4">
                이메일
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow
                key={`fixed-${student.userId}-${index}`}
                className="hover:bg-[#1C1F2B]/50 border-b border-gray-700/30 last:border-b-0"
              >
                <TableCell className="w-[60px] bg-[#252A3C] font-medium text-gray-300 h-[58px] px-4">
                  {index + 1}
                </TableCell>
                <TableCell className="bg-[#252A3C] font-medium text-gray-300 h-[58px] px-4">
                  {student.userName}
                </TableCell>
                <TableCell className="bg-[#252A3C] text-gray-400 h-[58px] px-4">
                  {student.userEmail}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 스크롤 영역 (과제 제출) */}
      <div className="w-[320px] overflow-x-auto bg-[#252A3C] relative">
        <div
          style={{
            width:
              students[0]?.submissions.length <= 4
                ? "320px"
                : `${students[0]?.submissions.length * 80}px`,
            minWidth: "320px",
          }}
        >
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 bg-[#1A1D29] z-10">
              <TableRow className="hover:bg-transparent border-b border-gray-700/30">
                {students[0]?.submissions.map((_, index) => (
                  <TableHead
                    key={index}
                    className="text-center whitespace-nowrap h-[58px] px-4"
                    style={{
                      width:
                        students[0].submissions.length <= 4
                          ? `${320 / students[0].submissions.length}px`
                          : "80px",
                    }}
                  >
                    {getLectureTitle(students[0].submissions, index)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow
                  key={`scroll-${student.userId}-${index}`}
                  className="hover:bg-[#1C1F2B]/50 border-b border-gray-700/30 last:border-b-0"
                >
                  {student.submissions.map((submission, lectureIndex) => (
                    <TableCell
                      key={`${student.userId}-${lectureIndex}`}
                      className="text-center cursor-pointer bg-[#252A3C] hover:bg-[#1C1F2B] h-[58px] px-4"
                      style={{
                        width:
                          student.submissions.length <= 4
                            ? `${320 / student.submissions.length}px`
                            : "80px",
                      }}
                      onClick={() => onSubmissionClick(student, lectureIndex)}
                    >
                      <div className="flex justify-center">
                        {submission.isSubmitted ? (
                          <div className="w-6 h-6 rounded-full bg-[#5046E4]/20 flex items-center justify-center">
                            <Check className="h-4 w-4 text-[#8C7DFF]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#1A1D29] flex items-center justify-center">
                            <X className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
