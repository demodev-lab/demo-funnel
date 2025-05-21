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

interface Challenge {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  lectureCount: number;
}

// 더미 데이터
const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: "1",
    name: "2024년 1기",
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 4, 30),
    lectureCount: 12,
  },
  {
    id: "2",
    name: "2024년 2기",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 7, 31),
    lectureCount: 12,
  },
  {
    id: "3",
    name: "2024년 3기",
    startDate: new Date(2024, 8, 1),
    endDate: new Date(2024, 10, 30),
    lectureCount: 12,
  },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(DUMMY_CHALLENGES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null,
  );
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    lectureCount: 0,
  });

  const handleAddChallenge = () => {
    if (
      newChallenge.name &&
      newChallenge.startDate &&
      newChallenge.endDate &&
      newChallenge.lectureCount
    ) {
      const challenge: Challenge = {
        id: (challenges.length + 1).toString(),
        name: newChallenge.name,
        startDate: newChallenge.startDate,
        endDate: newChallenge.endDate,
        lectureCount: newChallenge.lectureCount,
      };
      setChallenges([...challenges, challenge]);
      setIsAddDialogOpen(false);
      setNewChallenge({
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        lectureCount: 0,
      });
    }
  };

  const handleDeleteChallenge = (id: string) => {
    setChallenges(challenges.filter((challenge) => challenge.id !== id));
  };

  const handleEditChallenge = (id: string) => {
    const challenge = challenges.find((c) => c.id === id);
    if (challenge) {
      setEditingChallenge(challenge);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateChallenge = () => {
    if (editingChallenge) {
      setChallenges(
        challenges.map((challenge) =>
          challenge.id === editingChallenge.id ? editingChallenge : challenge,
        ),
      );
      setIsEditDialogOpen(false);
      setEditingChallenge(null);
    }
  };

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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">시작일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newChallenge.startDate?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        startDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">종료일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newChallenge.endDate?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        endDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lectureCount">강의 개수</Label>
                  <Input
                    id="lectureCount"
                    type="number"
                    value={newChallenge.lectureCount}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        lectureCount: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <Button onClick={handleAddChallenge} className="w-full">
                  추가
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
                  value={editingChallenge?.name}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? { ...editingChallenge, name: e.target.value }
                        : null,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">시작일</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={
                    editingChallenge?.startDate.toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? {
                            ...editingChallenge,
                            startDate: new Date(e.target.value),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">종료일</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editingChallenge?.endDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? {
                            ...editingChallenge,
                            endDate: new Date(e.target.value),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lectureCount">강의 개수</Label>
                <Input
                  id="edit-lectureCount"
                  type="number"
                  value={editingChallenge?.lectureCount}
                  onChange={(e) =>
                    setEditingChallenge(
                      editingChallenge
                        ? {
                            ...editingChallenge,
                            lectureCount: parseInt(e.target.value),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <Button onClick={handleUpdateChallenge} className="w-full">
                수정
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
            {challenges.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>{challenge.name}</TableCell>
                <TableCell>
                  {challenge.startDate.toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  {challenge.endDate.toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>{challenge.lectureCount}개</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditChallenge(challenge.id)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                    >
                      삭제
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
