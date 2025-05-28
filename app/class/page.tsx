import { DemoUI } from '@/components/demo-ui';

export default function ClassPage () {
 return(
  <div className="min-h-screen bg-gradient-to-b from-[#1A1D29] to-[#252A3C] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block animate-float">
              <span className="relative z-10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">demo-funnel</span>
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#5046E4]/20 to-[#8C7DFF]/20 rounded-full blur-sm"></span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-slide-up">
              개발 챌린지를 깨우는 매일의 잠금 해제 서비스
            </p>
          </div>

          {/* FIXME: 애니메이션 추가시, 깜빡임 발생 */}
          {/* <div className="transform transition-all duration-500 hover:scale-[1.01] shadow-xl rounded-2xl overflow-hidden animate-slide-up"> */}
          <div>
            <DemoUI />
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 demo-funnel. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#5046E4] transition-colors">이용약관</a>
            <a href="#" className="text-gray-400 hover:text-[#5046E4] transition-colors">개인정보 보호</a>
            <a href="#" className="text-gray-400 hover:text-[#5046E4] transition-colors">문의하기</a>
          </div>
        </div>
      </footer>
    </div>
 )
}