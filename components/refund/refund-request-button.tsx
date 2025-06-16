import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefundRequestForm, RefundFormData } from "./refund-request-form";
import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/utils/errorHandler";

interface RefundRequestButtonProps {
  isAllSubmitted: boolean;
  isRefundRequested: boolean;
}

export const RefundRequestButton = ({
  isAllSubmitted,
  isRefundRequested,
}: RefundRequestButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: RefundFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        handleError(
          new Error("환급 신청 처리 중 오류가 발생했습니다."),
          "환급 신청 처리 중 오류가 발생했습니다.",
        );
      }

      toast({
        title: "환급 신청이 완료되었습니다",
        description: "빠른 시일 내에 처리해드리겠습니다.",
      });
      setIsOpen(false);
    } catch (error) {
      handleError(error, "환급 신청 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-gray-700/50 bg-[#1A1D29]/30 px-6 pb-16 relative">
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!isAllSubmitted || isRefundRequested}
        className="absolute right-6 w-1/6 bg-[#5046E4] hover:bg-[#4339D1] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:hover:bg-gray-500"
      >
        {isRefundRequested ? "환급신청 완료" : "환급신청 하기"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              환급 신청
            </DialogTitle>
          </DialogHeader>
          <RefundRequestForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
