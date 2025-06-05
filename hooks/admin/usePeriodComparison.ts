import { DashboardAssignmentStat } from "@/types/assignment";
import { useEffect, useRef, useState } from "react";

interface ComparisonResult {
  currentValue: number | undefined;
  previousValue: number | undefined;
  percentageChange: number | undefined;
  isPositive: boolean;
  formattedChange: { value: string; isPositive: boolean } | undefined;
  lastUpdated: string;
}

export function usePeriodComparison(
  currentData: DashboardAssignmentStat[] | undefined,
  previousData: DashboardAssignmentStat[] | undefined,
  isFirstPeriod: boolean,
  type: "totalStudents" | "submissionRate"
): ComparisonResult {
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const previousDataRef = useRef<string>("");

  // 현재 기수 값 계산
  const currentValue = currentData?.[0]?.totalParticipants;

  // 이전 기수 값 계산
  const previousValue = previousData?.[0]?.totalParticipants;

  // 평균 제출률 계산
  const calculateAverageRate = (data: DashboardAssignmentStat[] | undefined) => {
    if (!data || data.length === 0) return undefined;
    return (
      data.reduce((sum, item) => sum + item.submissionRate, 0) / data.length
    ).toFixed(0);
  };

  // 현재와 이전 기수의 평균 제출률
  const currentRate = type === "submissionRate" ? calculateAverageRate(currentData) : undefined;
  const previousRate = type === "submissionRate" ? calculateAverageRate(previousData) : undefined;

  // 변화량 계산
  let percentageChange: number | undefined = undefined;
  let isPositive: boolean = false;

  if (type === "totalStudents") {
    if (currentValue !== undefined && previousValue !== undefined) {
      if (previousValue === 0) {
        if (currentValue > 0) {
          percentageChange = 100;
          isPositive = true;
        } else {
          percentageChange = 0;
          isPositive = true;
        }
      } else {
        percentageChange = ((currentValue - previousValue) / previousValue) * 100;
        isPositive = percentageChange >= 0;
      }
    }
  } else {
    if (currentRate !== undefined && previousRate !== undefined) {
      const current = Number(currentRate);
      const previous = Number(previousRate);

      if (previous === 0) {
        if (current > 0) {
          percentageChange = 100;
          isPositive = true;
        } else {
          percentageChange = 0;
          isPositive = true;
        }
      } else {
        percentageChange = ((current - previous) / previous) * 100;
        isPositive = percentageChange >= 0;
      }
    }
  }

  // 포맷팅된 변화량
  const formattedChange =
    !isFirstPeriod && percentageChange !== undefined
      ? {
          value: `${
            isPositive && percentageChange > 0 ? "+" : ""
          }${percentageChange.toFixed(0)}%`,
          isPositive,
        }
      : undefined;

  // 데이터 변경 감지 및 lastUpdated 업데이트
  useEffect(() => {
    const currentDataString = JSON.stringify({
      currentValue,
      currentRate,
      previousValue,
      previousRate,
    });

    if (currentDataString !== previousDataRef.current) {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;
      setLastUpdated(formattedDate);
      previousDataRef.current = currentDataString;
    }
  }, [currentValue, currentRate, previousValue, previousRate]);

  return {
    currentValue: type === "submissionRate" ? Number(currentRate) : currentValue,
    previousValue: type === "submissionRate" ? Number(previousRate) : previousValue,
    percentageChange,
    isPositive,
    formattedChange,
    lastUpdated,
  };
} 