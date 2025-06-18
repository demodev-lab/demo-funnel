import { login } from "@/app/admin/(auth)/login/actions";
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

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A1D29] to-[#252A3C] text-white">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      <div className="relative w-full max-w-md px-4 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
              demo-funnel
            </span>
          </h1>
          <p className="text-gray-400">관리자 포털</p>
        </div>

        <Card className="border border-gray-700/50 bg-[#1C1F2B]/70 backdrop-blur-md shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 border-b border-gray-700/50 bg-[#1A1D29]/50 pb-6">
            <CardTitle className="text-xl font-bold text-white">
              관리자 로그인
            </CardTitle>
            <CardDescription className="text-gray-400">
              계정 정보를 입력하여 관리자 대시보드에 접속하세요
            </CardDescription>
          </CardHeader>
          <form className="animate-slide-up">
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 bg-[#1A1D29]/30 border-t border-gray-700/50 p-6">
              <Button
                formAction={login}
                className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                로그인
              </Button>
              <div className="text-center text-sm text-gray-500">
                <span>보안 인증된 관리자 포털</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
