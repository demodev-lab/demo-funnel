"use client";

import { userLogin } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();
  const lectureId = searchParams.get("lectureId");

  const loginMutation = useMutation({
    mutationFn: (email: string) => userLogin(email),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error("로그인 실패", {
          description: response.error,
        });
        return;
      }

      if (response.user) {
        // 사용자 정보를 쿼리 캐시에 저장
        queryClient.setQueryData(["user"], response.user);

        toast.success("로그인 성공", {
          description: "강의실로 이동합니다.",
        });

        setTimeout(() => {
          // lectureId가 있으면 해당 강의로 이동
          if (lectureId) {
            router.push(`/class?lectureId=${lectureId}`);
          } else {
            router.push("/class");
          }
        }, 1500);
      }
    },
    onError: (error) => {
      toast.error("로그인 실패", {
        description: "로그인 처리 중 오류가 발생했습니다.",
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
                disabled={loginMutation.isPending}
                className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-[#1A1D29]/30 border-t border-gray-700/50 p-6">
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                로그인 중...
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
