"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendEmails } from "@/apis/email";
import { EmailTemplateType } from "@/types/email";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { useStudentsByChallenge } from "@/hooks/useStudents";
import { User } from "@/types/user";
import { EMAIL_TEMPLATES } from "@/constants/email-templates";

const emailLogs = [
  {
    id: 1,
    date: "2024-05-18",
    template: "강의 오픈 알림",
    targets: 120,
    success: 118,
  },
  {
    id: 2,
    date: "2024-05-15",
    template: "과제 제출 독려!",
    targets: 45,
    success: 45,
  },
];

export default function EmailSender() {
  const { selectedChallengeId } = useChallengeStore();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useStudentsByChallenge(selectedChallengeId, undefined);

  const students = data?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  const [selectedTemplate, setSelectedTemplate] = useState("lecture-open");
  const [selectAll, setSelectAll] = useState(false);
  const [studentList, setStudentList] = useState<
    (User & { selected?: boolean })[]
  >([]);
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (students.length > 0) {
      setStudentList(
        students.map((student) => ({
          ...student,
          selected: false,
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    const template = EMAIL_TEMPLATES[selectedTemplate];
    if (!template) return;

    const variables = getTemplateVariables();
    const content = template.content
      .replace("{lectureName}", variables.lectureName || "")
      .replace("{openDate}", variables.openDate || "")
      .replace("{assignmentName}", variables.assignmentName || "")
      .replace("{dueDate}", variables.dueDate || "")
      .replace("{name}", "회원"); // 미리보기용 기본값

    setEmailContent(content);
  }, [selectedTemplate]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setStudentList(
      studentList.map((student) => ({
        ...student,
        selected: newSelectAll,
      })),
    );
  };

  const handleSelectStudent = (id: number) => {
    const updatedList = studentList.map((student) =>
      student.id === id ? { ...student, selected: !student.selected } : student,
    );
    setStudentList(updatedList);
    setSelectAll(updatedList.every((student) => student.selected));
  };

  const getTemplatePreview = () => {
    switch (selectedTemplate) {
      case "lecture-open":
        return "안녕하세요, {이름}님!\n\n코드언락의 새로운 강의가 오픈되었습니다. 지금 바로 확인해보세요.\n\n강의명: {강의명}\n오픈일: {오픈일}\n\n코드언락 드림";
      case "assignment-reminder":
        return "안녕하세요, {이름}님!\n\n아직 제출하지 않은 과제가 있습니다. 기한 내에 제출해주세요.\n\n과제명: {과제명}\n제출기한: {제출기한}\n\n코드언락 드림";
      default:
        return "";
    }
  };

  const getTemplateVariables = () => {
    switch (selectedTemplate) {
      case "lecture-open":
        return {
          lectureName: "React 기초 강의", // 실제로는 강의 정보에서 가져와야 함
          openDate: new Date().toLocaleDateString(),
          customContent: emailContent || undefined,
        };
      case "assignment-reminder":
        return {
          assignmentName: "리액트 컴포넌트 만들기", // 실제로는 과제 정보에서 가져와야 함
          dueDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString(),
          customContent: emailContent || undefined,
        };
      default:
        return {};
    }
  };

  const handleSendEmails = async () => {
    const selectedStudents = studentList.filter((student) => student.selected);

    if (selectedStudents.length === 0) {
      toast.error("선택된 학생이 없습니다.");
      return;
    }

    try {
      setIsSending(true);

      const response = await sendEmails({
        to: selectedStudents.map((student) => student.email),
        template: selectedTemplate as EmailTemplateType,
        variables: {
          ...getTemplateVariables(),
          customContent: emailContent, // 수정된 내용 전체를 전송
        },
      });

      if (response.success) {
        toast.success("이메일이 성공적으로 전송되었습니다.");
        setSelectAll(false);
        setStudentList(
          studentList.map((student) => ({ ...student, selected: false })),
        );
      } else {
        toast.error(response.message || "이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 전송 에러:", error);
      toast.error("이메일 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Tabs defaultValue="send" className="pt-6">
      <TabsList className="bg-[#1A1D29]/60 border border-gray-700/30">
        <TabsTrigger
          value="send"
          className="data-[state=active]:bg-[#5046E4] data-[state=active]:text-white"
        >
          이메일 발송
        </TabsTrigger>
        <TabsTrigger
          value="logs"
          className="data-[state=active]:bg-[#5046E4] data-[state=active]:text-white"
        >
          발송 로그
        </TabsTrigger>
      </TabsList>

      <TabsContent value="send" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#252A3C] border-gray-700/30 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base text-gray-300">대상 선택</Label>
                  <div className="mt-2">
                    <div className="bg-[#1A1D29]/40 border border-gray-700/30 rounded-lg overflow-hidden">
                      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <Table>
                          <TableHeader className="bg-[#1A1D29]/60 sticky top-0 z-10">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="w-12">
                                <Checkbox
                                  checked={selectAll}
                                  onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                              <TableHead>이름</TableHead>
                              <TableHead>이메일</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentList.map((student) => (
                              <TableRow
                                key={student.id}
                                className="hover:bg-[#1C1F2B]/50"
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={student.selected}
                                    onCheckedChange={() =>
                                      handleSelectStudent(student.id)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {student.name}
                                </TableCell>
                                <TableCell className="text-gray-400">
                                  {student.email}
                                </TableCell>
                              </TableRow>
                            ))}
                            {hasNextPage && (
                              <TableRow ref={ref}>
                                <TableCell
                                  colSpan={3}
                                  className="text-center py-4"
                                >
                                  {isFetchingNextPage ? (
                                    <div className="text-gray-400">
                                      로딩 중...
                                    </div>
                                  ) : (
                                    <div className="text-gray-400">더 보기</div>
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      {studentList.filter((s) => s.selected).length}명 선택됨
                      {isLoading && " (로딩 중...)"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#252A3C] border-gray-700/30 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base text-gray-300">템플릿 선택</Label>
                  <RadioGroup
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border border-gray-700/30 bg-[#1A1D29]/40 p-3 hover:bg-[#1A1D29]/60 transition-colors">
                      <RadioGroupItem value="lecture-open" id="lecture-open" />
                      <Label
                        htmlFor="lecture-open"
                        className="flex-1 text-gray-300"
                      >
                        📢 강의 오픈 알림
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border border-gray-700/30 bg-[#1A1D29]/40 p-3 hover:bg-[#1A1D29]/60 transition-colors">
                      <RadioGroupItem
                        value="assignment-reminder"
                        id="assignment-reminder"
                      />
                      <Label
                        htmlFor="assignment-reminder"
                        className="flex-1 text-gray-300"
                      >
                        📬 과제 제출 독려
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base text-gray-300">이메일 내용</Label>
                  <Textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="이메일 내용을 입력하세요..."
                    className="mt-2 min-h-[300px] bg-[#1A1D29]/60 border-gray-700/30 text-gray-300 font-mono"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={handleSendEmails}
                  disabled={isSending}
                >
                  {isSending ? "전송 중..." : "발송하기"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="logs" className="pt-6">
        <Card className="bg-[#252A3C] border-gray-700/30 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <Table>
              <TableHeader className="bg-[#1A1D29]/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead>발송 날짜</TableHead>
                  <TableHead>템플릿 유형</TableHead>
                  <TableHead className="text-right">대상 수</TableHead>
                  <TableHead className="text-right">수신 성공 수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-[#1C1F2B]/50">
                    <TableCell className="text-gray-300">{log.date}</TableCell>
                    <TableCell className="text-gray-300">
                      {log.template}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {log.targets}명
                    </TableCell>
                    <TableCell className="text-right text-green-400">
                      {log.success}명
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
