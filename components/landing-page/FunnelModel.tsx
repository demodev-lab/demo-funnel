import { Badge } from "../common/badge";

export default function FunnelModel() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            대모퍼널에서 제안하는 퍼널 마케팅 모델
          </h2>
          <p className="text-slate-300 text-lg">
            실제로 검증된 퍼널 마케팅 모델을 제시합니다
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-[#5046E4]/20 text-[#8C7DFF] mb-4">
                추천 모델
              </Badge>
              <h3 className="text-2xl font-bold text-white mb-4">
                환급 챌린지 퍼널
              </h3>
              <div className="space-y-3 text-slate-300">
                <p>• 환급 조건부 챌린지로 고객 참여 유도</p>
                <p>• 챌린지를 통해 컨텐츠 가치 경험</p>
                <p>• 자연스러운 추가 컨텐츠 결제 촉진</p>
                <p>• 높은 참여율과 전환율 달성</p>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                챌린지 퍼널 흐름
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#5046E4] rounded-full flex items-center justify-center text-xs text-white">
                    1
                  </div>
                  <span className="text-slate-300">저가 챌린지 참여</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#5046E4] rounded-full flex items-center justify-center text-xs text-white">
                    2
                  </div>
                  <span className="text-slate-300">미션 수행 & 가치 경험</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#5046E4] rounded-full flex items-center justify-center text-xs text-white">
                    3
                  </div>
                  <span className="text-slate-300">환급 조건 달성</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#5046E4] rounded-full flex items-center justify-center text-xs text-white">
                    4
                  </div>
                  <span className="text-slate-300">
                    심화 과정 자연스러운 제안
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-400">
            앞으로 더 다양한 퍼널 마케팅 모델을 제시할 예정입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
