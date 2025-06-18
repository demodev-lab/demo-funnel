import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import { Challenge } from "@/types/challenge";

interface EditChallengeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: Challenge | null;
  onChallengeChange: (field: "name", value: string) => void;
  onDateChange: (field: "startDate" | "endDate", value: string) => void;
  onSubmit: () => void;
  isUpdating: boolean;
}

export default function EditChallengeDialog({
  isOpen,
  onOpenChange,
  challenge,
  onChallengeChange,
  onDateChange,
  onSubmit,
  isUpdating,
}: EditChallengeDialogProps) {
  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">챌린지 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-gray-300">
              기수 이름
            </Label>
            <Input
              id="edit-name"
              value={challenge.name}
              className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20"
              onChange={(e) => onChallengeChange("name", e.target.value)}
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
              value={challenge.startDate?.toISOString().split("T")[0]}
              onChange={(e) => onDateChange("startDate", e.target.value)}
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
              value={challenge.endDate?.toISOString().split("T")[0]}
              onChange={(e) => onDateChange("endDate", e.target.value)}
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
              value={challenge.lectureCount || 0}
              disabled={true}
              readOnly
            />
            <p className="text-sm text-gray-400">
              강의 개수는 시작일과 종료일을 기준으로 자동 계산됩니다.
            </p>
          </div>
          <Button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
          >
            수정 완료
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
