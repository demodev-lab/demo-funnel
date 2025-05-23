import { DemoUI } from "@/components/demo-ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1C1F2B] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            <span className="text-[#5046E4]">demo-funnel</span>
          </h1>
          <p className="text-center text-gray-400 mb-12">
            개발 챌린지를 깨우는 매일의 잠금 해제 서비스
          </p>

          <DemoUI />
        </div>
      </div>

      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-800">
        <div className="text-center text-sm text-gray-500">
          © 2025 demo-funnel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
