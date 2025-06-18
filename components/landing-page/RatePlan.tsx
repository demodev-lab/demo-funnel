import { CheckCircle } from "lucide-react";
import { Badge } from "../common/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../common/card";

export default function RatePlan() {
  return (
    <section className="py-20 px-4 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">요금제</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-b from-slate-800 to-slate-700 border-slate-600 relative">
            <CardHeader>
              <Badge className="bg-green-600/20 text-green-300 w-fit">
                무료
              </Badge>
              <CardTitle className="text-white">무료 진단</CardTitle>
              <CardDescription className="text-slate-300">
                기본 설문과 간략 피드백
              </CardDescription>
              <div className="text-3xl font-bold text-white">₩0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  기본 퍼널 진단
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  간략한 피드백 제공
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-slate-800 to-slate-700 border-slate-600">
            <CardHeader>
              <Badge className="bg-blue-600/20 text-blue-300 w-fit">
                스타터
              </Badge>
              <CardTitle className="text-white">스타터</CardTitle>
              <CardDescription className="text-slate-300">
                퍼널 진단 + 전략 시안
              </CardDescription>
              <div className="text-3xl font-bold text-white">₩490,000</div>
              <div className="text-sm text-slate-400">/1회</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  퍼널 진단
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  전략 시안 제공
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />웹 기획
                  구조안
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-[#5046E4] to-[#4338CA] border-[#5046E4] relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-600 text-white">인기</Badge>
            </div>
            <CardHeader>
              <Badge className="bg-[#5046E4]/20 text-[#8C7DFF] w-fit">
                프로
              </Badge>
              <CardTitle className="text-white">프로</CardTitle>
              <CardDescription className="text-slate-300">
                맞춤형 사이트 제작 포함
              </CardDescription>
              <div className="text-3xl font-bold text-white">₩1,490,000</div>
              <div className="text-sm text-slate-400">/1회</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  스타터 플랜 모든 기능
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  맞춤형 사이트 제작 (1페이지)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  퍼널 최적화 컨설팅
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-b from-slate-800 to-slate-700 border-slate-600">
            <CardHeader>
              <Badge className="bg-yellow-600/20 text-yellow-300 w-fit">
                그로스
              </Badge>
              <CardTitle className="text-white">그로스</CardTitle>
              <CardDescription className="text-slate-300">
                완전한 퍼널 자동화
              </CardDescription>
              <div className="text-3xl font-bold text-white">₩2,990,000</div>
              <div className="text-sm text-slate-400">/1회</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  프로 플랜 모든 기능
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  전체 퍼널 설계
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  자동화 연동 구축
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  성과 추적 시스템
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
