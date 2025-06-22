export default function ClassFooter() {
  return (
    <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-400 mb-4 md:mb-0">
          © 2025 demo-funnel. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a
            href="#"
            className="text-gray-400 hover:text-[#5046E4] transition-colors"
          >
            이용약관
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#5046E4] transition-colors"
          >
            개인정보 보호
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-[#5046E4] transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>
    </footer>
  );
} 