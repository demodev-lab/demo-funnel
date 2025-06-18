import Image from "next/image";

export default function ServiceExample() {
  return (
    <section className="py-20 px-4 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            실제 서비스 화면
          </h2>
          <p className="text-slate-300 text-lg">
            어드민 시스템을 통해 실제 어떻게 운영되는지 확인해보세요
          </p>
        </div>
        <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700">
          <Image
            src="/dashboard-preview.png"
            alt="대모퍼널 어드민 대시보드"
            width={1200}
            height={600}
            className="w-full rounded-lg"
          />
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
            <div>
              <h4 className="text-white font-semibold mb-2">수강생 관리</h4>
              <p className="text-slate-400 text-sm">참여자 현황 및 진도 추적</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">과제 제출률</h4>
              <p className="text-slate-400 text-sm">단계별 참여도 분석</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">전환율 추적</h4>
              <p className="text-slate-400 text-sm">
                퍼널 성과 실시간 모니터링
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
