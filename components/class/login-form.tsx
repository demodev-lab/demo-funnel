"use client";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckCircle } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userLogin } from "@/apis/auth";
import { getUserChallenges } from "@/apis/challenges";
import { IcLoadingSpinner } from "@/components/common/ic-loading-spinner";
import { IcEmail } from "@/components/common/ic-email";
export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (email: string) => userLogin(email),
    onSuccess: async (response) => {
      if (!response.success || !response.user) {
        toast.error("로그인 실패", {
          description: response.error || "로그인에 실패했습니다.",
        });
        return;
      }

      // 사용자 정보를 쿼리 캐시에 저장
      queryClient.setQueryData(["user"], response.user);

      // 챌린지 목록을 쿼리 캐시에 저장
      const challenges = await getUserChallenges(response.user.id);
      queryClient.setQueryData(
        ["challenge-list", response.user.id],
        challenges,
      );
      setIsSuccess(true);

      toast.success("로그인 성공", {
        description: "강의실로 이동합니다.",
      });

      setTimeout(() => {
        if (challenges.length > 0) {
          router.push(`/class/${challenges[0].id}`);
        }
      }, 1500);
    },
    onError: (error) => {
      toast.error("로그인 실패", {
        description:
          error instanceof Error
            ? error.message
            : "로그인 처리 중 오류가 발생했습니다.",
      });
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(email);
  };

  return (
    <Card className="border border-gray-700/50 bg-[#1C1F2B]/70 backdrop-blur-md shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 border-b border-gray-700/50 bg-[#1A1D29]/50 pb-6">
        <CardTitle className="text-xl font-bold text-white">
          수강생 로그인
        </CardTitle>
        <CardDescription className="text-gray-400">
          등록된 이메일을 입력하여 서비스에 접속하세요
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="animate-slide-up">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              이메일
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loginMutation.isPending || isSuccess}
                className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg pl-10"
              />
              <IcEmail
                width={20}
                height={20}
                color="#6B7280"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-[#1A1D29]/30 border-t border-gray-700/50 p-6">
          <Button
            type="submit"
            disabled={loginMutation.isPending || isSuccess}
            className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <IcLoadingSpinner
                  width={16}
                  height={16}
                  color="#FFFFFF"
                  className="animate-spin"
                />
                로그인 중...
              </div>
            ) : isSuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                로그인 성공!
              </div>
            ) : (
              "로그인"
            )}
          </Button>
          <div className="text-center text-sm text-gray-500">
            <span>등록된 수강생만 이용 가능한 서비스입니다</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
