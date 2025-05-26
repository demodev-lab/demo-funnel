"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/admin/header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChallenges,
  addChallenge,
  deleteChallenge,
  updateChallenge,
  ChallengeFormData,
} from "@/apis/challenges";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: number;
  name: string;
  open_date: string;
  close_date: string;
  lecture_num: number;
  created_at?: string;
  updated_at?: string;
  startDate?: Date;
  endDate?: Date;
  lectureCount?: number;
}

export default function ChallengesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newChallenge, setNewChallenge] = useState<ChallengeFormData>({
    name: "",
    open_date: new Date().toISOString().split("T")[0],
    close_date: new Date().toISOString().split("T")[0],
    lecture_num: 0,
  });

  const queryClient = useQueryClient();

  // 챌린지 목록 조회
  const {
    data: challenges = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  // 챌린지 추가
  const { mutate: createChallenge, isPending: isCreating } = useMutation({
    mutationFn: (data: ChallengeFormData) => addChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("챌린지가 성공적으로 추가되었습니다.");
      setIsAddDialogOpen(false);
      setNewChallenge({
        name: "",
        open_date: new Date().toISOString().split("T")[0],
        close_date: new Date().toISOString().split("T")[0],
        lecture_num: 0,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "챌린지 추가 중 오류가 발생했습니다.");
    },
  });

  // 챌린지 삭제
  const { mutate: removeChallenge, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("챌린지가 성공적으로 삭제되었습니다.");
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "챌린지 삭제 중 오류가 발생했습니다.");
      setDeletingId(null);
    },
  });

  // 챌린지 수정
  const { mutate: modifyChallenge, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Challenge> }) =>
      updateChallenge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("챌린지가 성공적으로 수정되었습니다.");
      setIsEditDialogOpen(false);
      setEditingChallenge(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "챌린지 수정 중 오류가 발생했습니다.",
      );
    },
  });

  const handleAddChallenge = () => {
    if (
      !newChallenge.name ||
      !newChallenge.open_date ||
      !newChallenge.close_date
    ) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 날짜 유효성 검사
    const openDate = new Date(newChallenge.open_date);
    const closeDate = new Date(newChallenge.close_date);

    if (closeDate <= openDate) {
      toast.error("종료일은 시작일보다 늦어야 합니다.");
      return;
    }

    if (newChallenge.lecture_num <= 0) {
      toast.error("강의 개수는 1개 이상이어야 합니다.");
      return;
    }

    createChallenge(newChallenge);
  };

  const handleDeleteChallenge = (id: string) => {
    if (window.confirm("정말로 이 챌린지를 삭제하시겠습니까?")) {
      setDeletingId(id);
      removeChallenge(id);
    }
  };

  const handleEditChallenge = (challenge: Challenge) => {
    const editChallenge = {
      ...challenge,
      startDate: new Date(challenge.open_date),
      endDate: new Date(challenge.close_date),
      lectureCount: challenge.lecture_num,
    };
    setEditingChallenge(editChallenge);
    setIsEditDialogOpen(true);
  };

  const handleUpdateChallenge = () => {
    if (!editingChallenge) return;

    if (
      !editingChallenge.name ||
      !editingChallenge.startDate ||
      !editingChallenge.endDate
    ) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 날짜 유효성 검사
    const openDate = editingChallenge.startDate;
    const closeDate = editingChallenge.endDate;

    if (closeDate <= openDate) {
      toast.error("종료일은 시작일보다 늦어야 합니다.");
      return;
    }

    if (editingChallenge.lectureCount && editingChallenge.lectureCount <= 0) {
      toast.error("강의 개수는 1개 이상이어야 합니다.");
      return;
    }

    modifyChallenge({
      id: editingChallenge.id.toString(),
      data: {
        name: editingChallenge.name,
        open_date: editingChallenge.startDate.toISOString().split("T")[0],
        close_date: editingChallenge.endDate.toISOString().split("T")[0],
        lecture_num: editingChallenge.lectureCount || 0,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">챌린지 목록을 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">오류가 발생했습니다</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          페이지 새로고침
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Header />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">챌린지 관리</h1>
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300">
                챌린지 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">새 챌린지 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    기수 이름
                  </Label>
                  <Input
                    id="name"
                    value={newChallenge.name}
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        name: e.target.value,
                      })
                    }
                    disabled={isCreating}
                    placeholder="예: 2024년 1기"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="open_date" className="text-gray-300">
                    시작일
                  </Label>
                  <Input
                    id="open_date"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={newChallenge.open_date}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        open_date: e.target.value,
                      })
                    }
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close_date" className="text-gray-300">
                    종료일
                  </Label>
                  <Input
                    id="close_date"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={newChallenge.close_date}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        close_date: e.target.value,
                      })
                    }
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecture_num" className="text-gray-300">
                    강의 개수
                  </Label>
                  <Input
                    id="lecture_num"
                    type="number"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    min="1"
                    value={newChallenge.lecture_num}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        lecture_num: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={isCreating}
                    placeholder="예: 12"
                  />
                </div>
                <Button
                  onClick={handleAddChallenge}
                  className="w-full"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      추가 중...
                    </>
                  ) : (
                    "추가"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">챌린지 수정</DialogTitle>
            </DialogHeader>
            {editingChallenge && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-gray-300">
                    기수 이름
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingChallenge.name}
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate" className="text-gray-300">
                    시작일
                  </Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={
                      editingChallenge.startDate?.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        startDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate" className="text-gray-300">
                    종료일
                  </Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={
                      editingChallenge.endDate?.toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        endDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lectureCount" className="text-gray-300">
                    강의 개수
                  </Label>
                  <Input
                    id="edit-lectureCount"
                    type="number"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={editingChallenge.lectureCount || 0}
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        lectureCount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleUpdateChallenge}
                  className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                  수정 완료
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
          <Table>
            <TableHeader className="bg-[#1A1D29]/60">
              <TableRow className="hover:bg-transparent">
                <TableHead>기수 이름</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>강의 개수</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
                <TableRow key={challenge.id} className="hover:bg-[#1C1F2B]/50">
                  <TableCell className="font-medium text-gray-300">
                    {challenge.name}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(challenge.open_date).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(challenge.close_date).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {challenge.lecture_num}개
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleEditChallenge(challenge)}
                      variant="ghost"
                      className="h-8 w-8 p-0 mr-1 text-gray-400 hover:text-[#8C7DFF] hover:bg-[#1A1D29]/60"
                    >
                      <span className="sr-only">Edit</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
                      </svg>
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteChallenge(challenge.id.toString())
                      }
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-[#1A1D29]/60"
                    >
                      <span className="sr-only">Delete</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
