export default function HeroSection() {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-[#5046E4] py-[150px] px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#8C7DFF] bg-clip-text text-transparent">
              대모퍼널
            </h1>
            <div className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto space-y-2">
              <p>퍼널 마케팅에 필요한 모든 것을 제공합니다.</p>
              <p>크리에이터님은 컨텐츠 제작에 집중하세요.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  