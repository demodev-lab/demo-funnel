import { LoginForm } from "@/components/login-form";

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
          <p className="text-gray-400">수강생 로그인</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
