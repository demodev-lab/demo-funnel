import { Loader2 } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/dialog";
import { ChallengeFormData } from "@/types/challenge";

interface AddChallengeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newChallenge: ChallengeFormData;
  onNewChallengeChange: (field: "name", value: string) => void;
  onDateChange: (field: "openDate" | "closeDate", value: string) => void;
  onSubmit: () => void;
  isCreating: boolean;
}

export default function AddChallengeDialog({
  isOpen,
  onOpenChange,
  newChallenge,
  onNewChallengeChange,
  onDateChange,
  onSubmit,
  isCreating,
}: AddChallengeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={(e) => onNewChallengeChange("name", e.target.value)}
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
              value={newChallenge.openDate}
              onChange={(e) => onDateChange("openDate", e.target.value)}
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
              value={newChallenge.closeDate}
              onChange={(e) => onDateChange("closeDate", e.target.value)}
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
              value={newChallenge.lectureNum}
              disabled={true}
              readOnly
            />
            <p className="text-sm text-gray-400">
              강의 개수는 시작일과 종료일을 기준으로 자동 계산됩니다.
            </p>
          </div>
          <Button onClick={onSubmit} className="w-full" disabled={isCreating}>
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
  );
}
