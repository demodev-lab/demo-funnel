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
    setEditingChallenge(challenge);
    setIsEditDialogOpen(true);
  };

  const handleUpdateChallenge = () => {
    if (!editingChallenge) return;

    if (
      !editingChallenge.name ||
      !editingChallenge.open_date ||
      !editingChallenge.close_date
    ) {
      toast.error("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 날짜 유효성 검사
    const openDate = new Date(editingChallenge.open_date);
    const closeDate = new Date(editingChallenge.close_date);

    if (closeDate <= openDate) {
      toast.error("종료일은 시작일보다 늦어야 합니다.");
      return;
    }

    if (editingChallenge.lecture_num <= 0) {
      toast.error("강의 개수는 1개 이상이어야 합니다.");
      return;
    }

    modifyChallenge({
      id: editingChallenge.id.toString(),
      data: {
        name: editingChallenge.name,
        open_date: editingChallenge.open_date,
        close_date: editingChallenge.close_date,
        lecture_num: editingChallenge.lecture_num,
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
              <Button className="bg-[#5046E4] hover:bg-[#5046E4]/90">
                챌린지 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 챌린지 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">기수 이름</Label>
                  <Input
                    id="name"
                    value={newChallenge.name}
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
                  <Label htmlFor="open_date">시작일</Label>
                  <Input
                    id="open_date"
                    type="date"
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
                  <Label htmlFor="close_date">종료일</Label>
                  <Input
                    id="close_date"
                    type="date"
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
                  <Label htmlFor="lecture_num">강의 개수</Label>
                  <Input
                    id="lecture_num"
                    type="number"
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>챌린지 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">기수 이름</Label>
                <Input
                  id="edit-name"
                  value={editingChallenge?.name || ""}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? { ...editingChallenge, name: e.target.value }
                        : null,
                    )
                  }
                  disabled={isUpdating}
                  placeholder="예: 2024년 1기"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-open_date">시작일</Label>
                <Input
                  id="edit-open_date"
                  type="date"
                  value={editingChallenge?.open_date || ""}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? {
                            ...editingChallenge,
                            open_date: e.target.value,
                          }
                        : null,
                    )
                  }
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-close_date">종료일</Label>
                <Input
                  id="edit-close_date"
                  type="date"
                  value={editingChallenge?.close_date || ""}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? {
                            ...editingChallenge,
                            close_date: e.target.value,
                          }
                        : null,
                    )
                  }
                  disabled={isUpdating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lecture_num">강의 개수</Label>
                <Input
                  id="edit-lecture_num"
                  type="number"
                  min="1"
                  value={editingChallenge?.lecture_num || ""}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? {
                            ...editingChallenge,
                            lecture_num: parseInt(e.target.value) || 0,
                          }
                        : null,
                    )
                  }
                  disabled={isUpdating}
                  placeholder="예: 12"
                />
              </div>
              <Button
                onClick={handleUpdateChallenge}
                className="w-full"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    수정 중...
                  </>
                ) : (
                  "수정"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>기수 이름</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>강의 개수</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...challenges]
              .sort((a, b) => a.id - b.id)
              .map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.name}</TableCell>
                  <TableCell>
                    {new Date(challenge.open_date).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    {new Date(challenge.close_date).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>{challenge.lecture_num}개</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditChallenge(challenge)}
                        disabled={isUpdating}
                      >
                        수정
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDeleteChallenge(challenge.id.toString())
                        }
                        disabled={
                          isDeleting && deletingId === challenge.id.toString()
                        }
                      >
                        {isDeleting &&
                        deletingId === challenge.id.toString() ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "삭제"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
