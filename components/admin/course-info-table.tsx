"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data
const students = [
  {
    id: 1,
    name: "홍길동",
    email: "test@example.com",
    submissions: [true, true, false, false, true],
  },
  {
    id: 2,
    name: "김철수",
    email: "kim@example.com",
    submissions: [true, false, true, true, false],
  },
  {
    id: 3,
    name: "이영희",
    email: "lee@example.com",
    submissions: [false, true, true, false, false],
  },
  {
    id: 4,
    name: "박지민",
    email: "park@example.com",
    submissions: [true, true, true, true, true],
  },
  {
    id: 5,
    name: "최유리",
    email: "choi@example.com",
    submissions: [false, false, false, true, false],
  },
]

export default function CourseInfoTable() {
  const [selectedSubmission, setSelectedSubmission] = useState<{
    studentId: number
    lectureId: number
    submitted: boolean
  } | null>(null)

  return (
    <>
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-[#1A1D29]/60">
            <TableRow className="hover:bg-transparent">
              <TableHead>수강생 이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="text-center">1강</TableHead>
              <TableHead className="text-center">2강</TableHead>
              <TableHead className="text-center">3강</TableHead>
              <TableHead className="text-center">4강</TableHead>
              <TableHead className="text-center">5강</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-[#1C1F2B]/50">
                <TableCell className="font-medium text-gray-300">{student.name}</TableCell>
                <TableCell className="text-gray-400">{student.email}</TableCell>
                {student.submissions.map((submitted, index) => (
                  <TableCell
                    key={index}
                    className="text-center cursor-pointer"
                    onClick={() =>
                      setSelectedSubmission({
                        studentId: student.id,
                        lectureId: index + 1,
                        submitted,
                      })
                    }
                  >
                    <div className="flex justify-center">
                      {submitted ? (
                        <div className="w-6 h-6 rounded-full bg-[#5046E4]/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-[#8C7DFF]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#1A1D29]/60 flex items-center justify-center">
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

      <Dialog open={selectedSubmission !== null} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-md bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedSubmission?.submitted ? "과제 제출 정보" : "미제출 과제"}</DialogTitle>
          </DialogHeader>
          {selectedSubmission?.submitted ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-200">
                  {students.find((s) => s.id === selectedSubmission.studentId)?.name} - {selectedSubmission.lectureId}강
                  과제
                </h3>
                <p className="text-sm text-gray-400">제출일: 2024-05-15 14:30</p>
              </div>
              <div className="border border-gray-700/30 rounded-md p-4 bg-[#1A1D29]/60">
                <p className="text-gray-300">
                  과제 내용이 여기에 표시됩니다. 실제 구현 시에는 과제 내용을 불러오거나 외부 링크로 연결할 수 있습니다.
                </p>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-[#8C7DFF] text-sm hover:underline">
                  외부 링크로 보기
                </a>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400">
              <p>아직 과제가 제출되지 않았습니다.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
