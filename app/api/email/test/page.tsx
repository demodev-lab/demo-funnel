"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Card } from "@/components/common/card";
import { toast } from "sonner";

export default function EmailTestPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const testTemplates = [
    {
      id: "lecture-open",
      name: "강의 오픈 알림",
      variables: {
        name: "테스트",
        lectureName: "테스트 강의",
        openDate: new Date().toLocaleDateString(),
      },
    },
    {
      id: "assignment-reminder",
      name: "과제 제출 독려",
      variables: {
        name: "테스트",
        assignmentName: "테스트 과제",
        dueDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
      },
    },
  ];

  const handleSendTest = async (template: (typeof testTemplates)[0]) => {
    if (!email) {
      toast.error("이메일 주소를 입력해주세요.");
      return;
    }

    try {
      setIsSending(true);

      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          template: template.id,
          variables: template.variables,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "이메일 전송 실패");
      }

      toast.success(`테스트 이메일이 ${email}로 전송되었습니다.`);
      console.log("전송 성공:", data);
    } catch (error: any) {
      console.error("테스트 이메일 전송 에러:", error);
      toast.error(
        error.message || "테스트 이메일 전송 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1D29] text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
            이메일 전송 테스트
          </span>
        </h1>

        <Card className="bg-[#252A3C] border-gray-700/30 p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">테스트용 이메일 주소</Label>
              <Input
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-[#1A1D29]/70 border-gray-700/50 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">테스트할 템플릿</Label>
              <div className="grid gap-3">
                {testTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-700/30 rounded-lg p-4 bg-[#1A1D29]/40"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-200">
                          {template.name}
                        </h3>
                        <pre className="mt-2 text-sm text-gray-400 whitespace-pre-wrap">
                          {JSON.stringify(template.variables, null, 2)}
                        </pre>
                      </div>
                      <Button
                        onClick={() => handleSendTest(template)}
                        disabled={isSending}
                        className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
                      >
                        {isSending ? "전송 중..." : "테스트 전송"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="text-sm text-gray-400">
          <h2 className="font-medium text-gray-300 mb-2">사용 방법:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>테스트용 이메일 주소를 입력합니다.</li>
            <li>
              테스트하고 싶은 템플릿의 &quot;테스트 전송&quot; 버튼을
              클릭합니다.
            </li>
            <li>입력한 이메일로 테스트 메일이 전송됩니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
