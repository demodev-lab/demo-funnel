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
                  <Label htmlFor="name" className="text-gray-300">기수 이름</Label>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-300">시작일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
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
                  <Label htmlFor="endDate" className="text-gray-300">종료일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
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
                  <Label htmlFor="lectureCount" className="text-gray-300">강의 개수</Label>
                  <Input
                    id="lectureCount"
                    type="number"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={newChallenge.lectureCount}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        lectureCount: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleAddChallenge}
                  className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                  추가
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
                  <Label htmlFor="edit-name" className="text-gray-300">기수 이름</Label>
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
                  <Label htmlFor="edit-startDate" className="text-gray-300">시작일</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={editingChallenge.startDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        startDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate" className="text-gray-300">종료일</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={editingChallenge.endDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        endDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lectureCount" className="text-gray-300">강의 개수</Label>
                  <Input
                    id="edit-lectureCount"
                    type="number"
                    className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
                    value={editingChallenge.lectureCount}
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        lectureCount: parseInt(e.target.value),
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
                  <TableCell className="font-medium text-gray-300">{challenge.name}</TableCell>
                  <TableCell className="text-gray-400">
                    {challenge.startDate.toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {challenge.endDate.toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-gray-300">{challenge.lectureCount}개</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleEditChallenge(challenge.id)}
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
                      onClick={() => handleDeleteChallenge(challenge.id)}
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
