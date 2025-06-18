"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../common/card";
import { Input } from "../common/input";
import { Button } from "../common/button";

export default function CTAForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with Notion API
    setIsSubmitted(true);
  };

  return (
    <section id="meeting-form" className="py-20 px-4 bg-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🚀 대모퍼널과 미팅 요청하기
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            퍼널 마케팅 전문가와 직접 상담받아보세요
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {!isSubmitted ? (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  미팅 요청하기
                </CardTitle>
                <CardDescription className="text-slate-300 text-center">
                  정보를 입력하시면 빠른 시일 내에 연락드리겠습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#5046E4] to-[#8C7DFF] hover:from-[#4338CA] hover:to-[#7C3AED] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    💬 미팅 요청하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-800/20 border-green-600/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    🎉 미팅 요청이 완료되었습니다!
                  </h3>
                  <p className="text-green-300">
                    빠른 시일 내에 연락드리겠습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
