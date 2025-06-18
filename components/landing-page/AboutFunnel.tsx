import { CheckCircle } from "lucide-react";

export default function AboutFunnel() {
  return (
    <section className="py-20 px-4 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            퍼널 마케팅이란?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-400 text-sm">❌</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    기존 방식의 문제점
                  </h3>
                  <p className="text-slate-300">
                    처음부터 고가의 서비스를 구매하는 것은 고객에게 진입장벽이
                    높습니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    퍼널 마케팅 해결책
                  </h3>
                  <p className="text-slate-300">
                    먼저 낮은 가격대의 서비스를 통해 고객과 신뢰를 형성하고
                    추가적인 서비스 구매를 촉진시킵니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              퍼널 마케팅 흐름
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5046E4]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#8C7DFF] font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    저가 상품으로 신뢰 구축
                  </p>
                  <p className="text-slate-400 text-sm">
                    진입장벽을 낮춰 고객 유입
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5046E4]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#8C7DFF] font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    가치 제공 및 관계 형성
                  </p>
                  <p className="text-slate-400 text-sm">
                    고객과의 신뢰 관계 구축
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5046E4]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#8C7DFF] font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    고가 상품 자연스러운 제안
                  </p>
                  <p className="text-slate-400 text-sm">
                    신뢰를 바탕으로 업셀링
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
