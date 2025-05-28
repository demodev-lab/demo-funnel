"use client";

import { login } from '@/app/login/actions';
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
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    try {
      const response = await login(formData);
      
      if (!response.success) {
        toast.error("로그인 실패", {
          description: response.error,
        });
        return;
      }

      toast.success("로그인 성공", {
        description: "강의실로 이동합니다.",
      });
      
      router.push("/class");
    } catch (error) {
      // console.error("로그인 처리 중 오류:", error);
      toast.error("로그인 실패", {
        description: "로그인 처리 중 오류가 발생했습니다.",
      });
    }
  }

  return (
    <Card className="border border-gray-700/50 bg-[#1C1F2B]/70 backdrop-blur-md shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 border-b border-gray-700/50 bg-[#1A1D29]/50 pb-6">
        <CardTitle className="text-xl font-bold text-white">수강생 로그인</CardTitle>
        <CardDescription className="text-gray-400">
          등록된 이메일을 입력하여 서비스에 접속하세요
        </CardDescription>
      </CardHeader>
      <form action={handleLogin} className="animate-slide-up">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              이메일
            </label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-[#1A1D29]/30 border-t border-gray-700/50 p-6">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
          >
            로그인
          </Button>
          <div className="text-center text-sm text-gray-500">
            <span>등록된 수강생만 이용 가능한 서비스입니다</span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
} 