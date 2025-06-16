"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardAssignmentStat } from "@/types/assignment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnrollmentRateDashboardProps {
  type: "submission" | "lecture";
  data?: DashboardAssignmentStat[];
}

interface DisplayItem {
  id: number;
  title: string;
  rate: number;
  count: number;
  total: number;
  sequence: number;
  currentOrder?: number;
}

export default function EnrollmentRateDashboard({
  type,
  data,
}: EnrollmentRateDashboardProps) {
  // TODO: api 연결 후 삭제
  const lecturesMock = [
    {
      id: 1,
      title: "JavaScript 기초",
      rate: 78,
      count: 94,
      total: 120,
      sequence: 1,
    },
    {
      id: 2,
      title: "함수와 스코프",
      rate: 65,
      count: 78,
      total: 120,
      sequence: 1,
    },
    {
      id: 3,
      title: "객체와 배열",
      rate: 90,
      count: 108,
      total: 120,
      sequence: 2,
    },
    {
      id: 4,
      title: "비동기 프로그래밍",
      rate: 72,
      count: 86,
      total: 120,
      sequence: 3,
    },
    {
      id: 5,
      title: "웹 API 활용",
      rate: 60,
      count: 72,
      total: 120,
      sequence: 3,
    },
  ];

  const displayData: DisplayItem[] =
    type === "submission" && data
      ? data.map((item) => ({
          id: item.lectureId,
          title: item.assignmentTitle,
          rate: item.submissionRate,
          count: item.submittedCount,
          total: item.totalParticipants,
          sequence: item.sequence,
        }))
      : lecturesMock;

  // sequence가 같은 강의의 개수를 계산
  const sequenceCounts = displayData.reduce(
    (acc, item) => {
      acc[item.sequence] = (acc[item.sequence] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  // sequence별 강의 순서를 추적하기 위한 임시 맵
  const sequenceOrderMap = new Map<number, number>();

  // sequence별 강의 순서를 계산
  const getSequenceOrder = (sequence: number) => {
    const currentCount = sequenceOrderMap.get(sequence) || 0;
    sequenceOrderMap.set(sequence, currentCount + 1);
    return currentCount + 1;
  };

  const getLectureNumber = (sequence: number) => {
    const count = sequenceCounts[sequence];
    const order = getSequenceOrder(sequence);
    if (count === 1) {
      return `${sequence}강`;
    }
    return `${sequence}-${order}강`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {displayData.map((item) => {
          const lectureNumber = getLectureNumber(item.sequence);
          return (
            <div key={item.id} className="flex flex-col">
              <div className="mb-2 text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm font-medium text-gray-400 cursor-help">
                        {type === "submission"
                          ? `${lectureNumber} 과제`
                          : lectureNumber}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#252A3C] border border-gray-700/30 text-gray-300 text-xs px-2 py-1 rounded-md shadow-sm">
                      {type === "submission"
                        ? `${lectureNumber}. ${item.title}`
                        : `${lectureNumber}: ${item.title}`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative h-40 bg-[#1A1D29]/60 rounded-lg overflow-hidden border border-gray-700/30">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#5046E4] to-[#8C7DFF] rounded-b-md transition-all duration-500"
                  style={{ height: `${item.rate}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {item.rate}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-400">
                {item.count}명 / {item.total}명
              </div>
            </div>
          );
        })}
      </div>

      <Card className="bg-[#1A1D29]/40 border-gray-700/30 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1D29]/60">
            <TableRow className="border-b-gray-700/30 hover:bg-transparent">
              <TableHead className="text-gray-400">
                {type === "submission" ? "과제명" : "강의명"}{" "}
              </TableHead>
              <TableHead className="text-right text-gray-400">
                {type === "submission" ? "제출률" : "수강률"}{" "}
              </TableHead>
              <TableHead className="text-right text-gray-400">
                {type === "submission" ? "제출 인원" : "수강 인원"}{" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item) => {
              // 테이블에서도 같은 Map을 사용하기 위해 새로운 Map 인스턴스 생성
              const tableSequenceOrderMap = new Map<number, number>();
              displayData.forEach((data) => {
                const currentCount =
                  tableSequenceOrderMap.get(data.sequence) || 0;
                if (data.id === item.id) {
                  item.currentOrder = currentCount + 1;
                }
                tableSequenceOrderMap.set(data.sequence, currentCount + 1);
              });

              const count = sequenceCounts[item.sequence];
              const lectureNumber =
                count === 1
                  ? `${item.sequence}강`
                  : `${item.sequence}-${item.currentOrder}강`;

              return (
                <TableRow
                  key={item.id}
                  className="border-b-gray-700/30 hover:bg-[#252A3C]/50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-300">
                    {type === "submission"
                      ? `${lectureNumber}. ${item.title}`
                      : `${lectureNumber}: ${item.title}`}{" "}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.rate >= 80
                          ? "bg-green-500/10 text-green-400"
                          : item.rate >= 60
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {item.rate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-gray-400">
                    <span className="font-medium text-white">
                      {item.count}명
                    </span>
                    / {item.total}명
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
