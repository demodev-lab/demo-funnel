"use client";

import dynamic from "next/dynamic";

const Realistic = dynamic(
  () =>
    import("react-canvas-confetti/dist/presets/realistic").then(
      (mod) => mod.default,
    ),
  { ssr: false },
);

interface AssignmentConfettiProps {
  isActive: boolean;
}

export default function AssignmentConfetti({
  isActive,
}: AssignmentConfettiProps) {
  if (!isActive) return null;

  return (
    <Realistic
      autorun={{ speed: 0.3 }}
      decorateOptions={(options) => ({
        ...options,
        colors: ["#5046E4", "#6A5AFF", "#DCD9FF"],
        particleCount: 60,
        // spread: 70, // 퍼짐 정도 설정
        startVelocity: 40, // 초기 속도 설정
        ticks: 200, // 애니메이션 지속 시간 설정
        origin: { x: 0.5, y: 0.7 }, // 발사 위치 설정
        // gravity: 2, // 중력 설정
      })}
    />
  );
}
