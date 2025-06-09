"use client";

import { useState } from "react";
import {
  setTestServerTime,
  getServerTime,
  checkIsTodayLecture,
  isLectureOpen,
} from "@/utils/date/serverTime";

export default function TestPage() {
  const [testTime, setTestTime] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleTest = async () => {
    if (!testTime) return;

    setTestServerTime(testTime);
    const serverTime = await getServerTime();
    let testResults = `서버 시간: ${serverTime}\n\n`;

    // 테스트 케이스
    const testCases = [
      {
        name: "오늘 강의 테스트",
        openAt: testTime,
      },
      {
        name: "내일 강의 테스트",
        openAt: new Date(
          new Date(testTime).getTime() + 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        name: "어제 강의 테스트",
        openAt: new Date(
          new Date(testTime).getTime() - 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];

    for (const testCase of testCases) {
      const isToday = await checkIsTodayLecture(testCase.openAt);
      const isOpenResult = await isLectureOpen(testCase.openAt);

      testResults += `${testCase.name}:\n`;
      testResults += `- 오늘 강의 여부: ${isToday}\n`;
      testResults += `- 오픈 여부: ${isOpenResult}\n\n`;
    }

    setResult(testResults);
  };

  const handleReset = () => {
    setTestServerTime(null);
    setTestTime("");
    setResult("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">서버 시간 테스트</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            테스트 시간 (ISO 문자열)
          </label>
          <input
            type="text"
            value={testTime}
            onChange={(e) => setTestTime(e.target.value)}
            placeholder="예: 2024-03-20T09:00:00.000Z"
            className="w-full p-2 border rounded bg-gray-800 border-gray-700"
          />
        </div>
        <div className="space-x-4">
          <button
            onClick={handleTest}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            테스트 실행
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            초기화
          </button>
        </div>
        {result && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">테스트 결과</h2>
            <pre className="p-4 bg-gray-800 rounded whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
