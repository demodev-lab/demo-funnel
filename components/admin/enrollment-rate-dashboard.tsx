"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EnrollmentRateDashboardProps {
  type: "submission" | "lecture"
}

export default function EnrollmentRateDashboard({ type }: EnrollmentRateDashboardProps) {
  // Mock data
  const lectures = [
    { id: 1, title: "1강: JavaScript 기초", rate: 78, count: 94 },
    { id: 2, title: "2강: 함수와 스코프", rate: 65, count: 78 },
    { id: 3, title: "3강: 객체와 배열", rate: 90, count: 108 },
    { id: 4, title: "4강: 비동기 프로그래밍", rate: 72, count: 86 },
    { id: 5, title: "5강: 웹 API 활용", rate: 60, count: 72 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {lectures.map((lecture) => (
          <div key={lecture.id} className="flex flex-col">
            <div className="text-sm font-medium mb-2 text-center text-gray-400">{lecture.id}강</div>
            <div className="relative h-40 bg-[#1A1D29]/60 rounded-lg overflow-hidden border border-gray-700/30">
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-[#5046E4] to-[#8C7DFF] rounded-b-md transition-all duration-500"
                style={{ height: `${lecture.rate}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{lecture.rate}%</span>
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-400">{lecture.count}명 / 120명</div>
          </div>
        ))}
      </div>

      <Card className="bg-[#1A1D29]/40 border-gray-700/30 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1D29]/60">
            <TableRow className="border-b-gray-700/30 hover:bg-transparent">
              <TableHead className="text-gray-400">
                {type === "submission" ? "과제명" : "강의명"}
              </TableHead>
              <TableHead className="text-right text-gray-400">
                {type === "submission" ? "제출률" : "수강률"}
              </TableHead>
              <TableHead className="text-right text-gray-400">
                {type === "submission" ? "제출 인원" : "수강 인원"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow
                key={lecture.id}
                className="border-b-gray-700/30 hover:bg-[#252A3C]/50 transition-colors"
              >
                <TableCell className="font-medium text-gray-300">{lecture.title}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lecture.rate >= 80
                        ? 'bg-green-500/10 text-green-400'
                        : lecture.rate >= 60
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {lecture.rate}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  <span className="font-medium text-white">{lecture.count}명</span> / 120명
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
