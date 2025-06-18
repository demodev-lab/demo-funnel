import { BookOpen, Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../common/card";

export default function Target() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            이런 분들께 추천드립니다
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/80 border-slate-700 hover:border-[#5046E4]/50 transition-colors">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-[#8C7DFF] mb-4" />
              <CardTitle className="text-white">온라인 강사</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                온라인 강의를 통해 수익을 창출하고 싶은 전문가
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/80 border-slate-700 hover:border-[#5046E4]/50 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-[#8C7DFF] mb-4" />
              <CardTitle className="text-white">코치</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                개인 코칭 서비스를 체계적으로 운영하고 싶은 코치
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/80 border-slate-700 hover:border-[#5046E4]/50 transition-colors">
            <CardHeader>
              <Briefcase className="h-12 w-12 text-[#8C7DFF] mb-4" />
              <CardTitle className="text-white">
                교육 스타트업 & 1인 크리에이터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                교육 콘텐츠로 비즈니스를 확장하고 싶은 창업가
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
