"use client";

import { useState } from "react";
import {
  setTestServerTime,
  getServerTime,
  isLectureOpen,
} from "@/utils/date/serverTime";

export default function TestPage() {
  const [testTime, setTestTime] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleTest = async () => {
    try {
      // 테스트 시간 설정
      setTestServerTime(testTime);

      // 현재 서버 시간 확인
      const serverTime = await getServerTime();

      // 테스트 케이스
      const testCases = [
        {
          name: "오늘 오픈된 강의",
          openAt: testTime,
          expected: true,
        },
        {
          name: "내일 오픈될 강의",
          openAt: new Date(
            new Date(testTime).getTime() + 24 * 60 * 60 * 1000,
          ).toISOString(),
          expected: false,
        },
        {
          name: "어제 오픈된 강의",
          openAt: new Date(
            new Date(testTime).getTime() - 24 * 60 * 60 * 1000,
          ).toISOString(),
          expected: false,
        },
      ];

      let testResults = `현재 서버 시간: ${serverTime}\n\n`;

      for (const testCase of testCases) {
        const isToday = await isLectureOpen(testCase.openAt);
        const isOpenResult = await isLectureOpen(testCase.openAt);

        testResults += `${testCase.name}:\n`;
        testResults += `open_at: ${testCase.openAt}\n`;
        testResults += `isTodayOpen: ${isToday} (예상: ${testCase.expected})\n`;
        testResults += `isOpen: ${isOpenResult} (예상: ${testCase.expected})\n\n`;
      }

      setResult(testResults);
    } catch (error) {
      setResult(`테스트 중 오류 발생: ${error}`);
    }
  };

  const handleReset = () => {
    setTestServerTime(null);
    setTestTime("");
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1D29] to-[#252A3C] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">서버 시간 테스트</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              테스트할 서버 시간 (ISO 문자열)
            </label>
            <input
              type="text"
              value={testTime}
              onChange={(e) => setTestTime(e.target.value)}
              placeholder="2024-03-20T00:00:00.000Z"
              className="w-full px-4 py-2 bg-[#1A1D29] border border-gray-700 rounded-lg focus:outline-none focus:border-[#5046E4]"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-[#5046E4] rounded-lg hover:bg-[#4338CA] transition-colors"
            >
              테스트 실행
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-[#1A1D29] border border-gray-700 rounded-lg">
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
