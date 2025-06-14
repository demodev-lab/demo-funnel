"use client";

import { use, useEffect } from "react";
import { useUser } from "@/hooks/auth/use-user";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DailyLectureSection from "@/components/daily-lecture/daily-lecture-section";
import { AssignmentSubmissionSection } from "@/components/daily-assignment/assignment-submission-section";
import { getUserLectures, getLecturesByChallenge } from "@/apis/lectures";
import { Lecture, LectureWithSequence } from "@/types/lecture";
import { useSelectedLectureStore } from "@/lib/store/useSelectedLectureStore";
import { checkIsTodayLecture } from "@/utils/date/serverTime";
import Header from "@/components/header";
import { useUserChallengeStore } from "@/lib/store/useUserChallengeStore";

export default function ClassPage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { challengeId } = use(params);
  const currentChallengeId = Number(challengeId);
  const { setSelectedChallengeId } = useUserChallengeStore();

  useEffect(() => {
    setSelectedChallengeId(currentChallengeId);
  }, [currentChallengeId]);

  // 진행 중인 챌린지의 강의 조회
  const { data: activeLectures = [] } = useQuery<Lecture[]>({
    queryKey: ["daily-lectures", user?.id],
    queryFn: async () => {
      const data = await getUserLectures(user.id);
      return data as unknown as Lecture[];
    },
    enabled: !!user?.id,
  });

  // 종료된 챌린지의 강의 조회
  const { data: completedLectures = [] } = useQuery<LectureWithSequence[]>({
    queryKey: ["challenge-lectures", currentChallengeId],
    queryFn: async () => {
      const data = await getLecturesByChallenge(currentChallengeId);
      return data;
    },
    enabled:
      !!user?.id &&
      !activeLectures.some(
        (lecture) => Number(lecture.challenge_id) === currentChallengeId,
      ),
  });

  const lectures = activeLectures.some(
    (lecture) => Number(lecture.challenge_id) === currentChallengeId,
  )
    ? activeLectures
    : completedLectures;
  const hasActiveChallenge = activeLectures.some(
    (lecture) => Number(lecture.challenge_id) === currentChallengeId,
  );

  const onSelectedLecture = useSelectedLectureStore(
    (state) => state.setSelectedLecture,
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (lectures && lectures.length > 0) {
      let isMounted = true;

      const findTodayLecture = async () => {
        for (const lecture of lectures) {
          if ("open_at" in lecture) {
            const isToday = await checkIsTodayLecture(lecture.open_at);
            if (isToday && isMounted) {
              onSelectedLecture(lecture as Lecture);
              return;
            }
          }
        }
        if (isMounted) {
          onSelectedLecture(lectures[0] as Lecture);
        }
      };

      findTodayLecture();

      return () => {
        isMounted = false;
      };
    }
  }, [user, isLoading, router, lectures]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1D29] to-[#252A3C] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="my-16 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold relative inline-block animate-float">
              <span className="relative z-10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
                  demo-funnel
                </span>
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#5046E4]/20 to-[#8C7DFF]/20 rounded-full blur-sm"></span>
            </h1>
          </div>

          <div className="flex justify-end w-full">
            <Header />
          </div>

          <div>
            <div className="bg-gradient-to-br from-[#252A3C] to-[#2A2F45] rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="transition-all duration-300 hover:brightness-105">
                <DailyLectureSection
                  lectures={lectures}
                  isActiveChallenge={hasActiveChallenge}
                />
              </div>

              <AssignmentSubmissionSection userInfo={user} />
            </div>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 demo-funnel. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-[#5046E4] transition-colors"
            >
              이용약관
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#5046E4] transition-colors"
            >
              개인정보 보호
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#5046E4] transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
