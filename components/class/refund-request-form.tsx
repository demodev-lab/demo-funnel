import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { Switch } from "@/components/common/switch";
import { useUser } from "@/hooks/auth/useUser";
import { updateRefundRequestStatus } from "@/apis/users";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";

interface RefundRequestFormProps {
  onSubmit: (data: RefundFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface RefundFormData {
  name: string;
  phone: string;
  email: string;
  account: string;
  assignmentLink: string;
  wantCoffeeChat: boolean;
  coffeeChatContent: string;
  futureContent: string;
}

export function RefundRequestForm({
  onSubmit,
  isSubmitting,
}: RefundRequestFormProps) {
  const { toast } = useToast();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const params = useParams();
  const challengeId = Number(params.challengeId);
  const [formData, setFormData] = useState<RefundFormData>({
    name: user?.name ?? "",
    account: "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    assignmentLink: "",
    wantCoffeeChat: false,
    coffeeChatContent: "",
    futureContent: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    const requiredFields = [
      "name",
      "account",
      "email",
      "phone",
      "assignmentLink",
      "futureContent",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof RefundFormData],
    );

    if (missingFields.length > 0) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "별표(*)가 있는 항목은 필수 입력사항입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);

      // 환급 신청 상태 업데이트
      if (user?.id) {
        await updateRefundRequestStatus(user.id, challengeId);
        // 쿼리키 무효화
        queryClient.invalidateQueries({
          queryKey: ["all-assignment-status", user.id, challengeId],
        });
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1/2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled
              className="bg-[#1C1F2B] border-gray-700"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="phone">
              전화번호<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="bg-[#1C1F2B] border-gray-700"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled
            className="bg-[#1C1F2B] border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="assignmentLink">
            과제 웹사이트 링크<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="assignmentLink"
            value={formData.assignmentLink}
            onChange={(e) =>
              setFormData({ ...formData, assignmentLink: e.target.value })
            }
            required
            className="bg-[#1C1F2B] border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="account">
            환급받을 계좌<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="account"
            value={formData.account}
            onChange={(e) =>
              setFormData({ ...formData, account: e.target.value })
            }
            required
            className="bg-[#1C1F2B] border-gray-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="wantsCoffeeChat"
            checked={formData.wantCoffeeChat}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, wantCoffeeChat: checked })
            }
            className="data-[state=checked]:bg-[#5046E4] bg-gray-700"
          />
          <Label htmlFor="wantsCoffeeChat">1대1 커피챗 희망 여부</Label>
          <span className="text-red-500 ml-1">*</span>
        </div>

        {formData.wantCoffeeChat && (
          <div>
            <Label htmlFor="coffeeChatContent">
              1대1 커피챗 다루고 싶은 내용
            </Label>
            <Textarea
              id="coffeeChatContent"
              value={formData.coffeeChatContent}
              onChange={(e) =>
                setFormData({ ...formData, coffeeChatContent: e.target.value })
              }
              placeholder="커피챗에서 다루고 싶은 주제나 질문을 작성해주세요"
              className="bg-[#1C1F2B] border-gray-700"
            />
          </div>
        )}

        <div>
          <Label htmlFor="futureContent">
            앞으로 보고싶은 콘텐츠를 적어주세요
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="futureContent"
            value={formData.futureContent}
            onChange={(e) =>
              setFormData({ ...formData, futureContent: e.target.value })
            }
            required
            placeholder="앞으로 어떤 콘텐츠를 보고 싶으신지 작성해주세요"
            className="bg-[#1C1F2B] border-gray-700"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#5046E4] hover:bg-[#4339D1] text-white"
      >
        {isSubmitting ? "제출 중..." : "환급 신청하기"}
      </Button>
    </form>
  );
}
