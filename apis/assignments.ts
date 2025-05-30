import { supabase } from "./supabase";

interface ChallengeLecture {
  id: number;
  lecture_id: number;
  Lectures: {
    id: number;
    name: string;
  };
}

export async function getAssignment(lectureId: number) {
  try {
    const { data: assignment, error } = await supabase
      .from("Assignments")
      .select("*")
      .eq("lecture_id", lectureId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    console.log("과제 정보:", assignment);

    return assignment || [];
  } catch (error) {
    console.error("과제 데이터 조회 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "강의 과제 데이터 조회 중 오류가 발생했습니다.",
    );
  }
}

export async function createSubmission({
  name,
  email,
  link,
  text,
  challengeLectureId,
  userId,
}: {
  name: string;
  email: string;
  link: string;
  text: string;
  challengeLectureId: number;
  userId: number;
}) {
  try {
    const { data, error } = await supabase.from("Submissions").insert([
      {
        user_id: userId,
        submitted_at: new Date().toISOString(),
        is_submit: true,
        assignment_url: link,
        assignment_comment: text,
        challenge_lecture_id: challengeLectureId,
      },
    ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("과제 제출 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "과제 제출 중 오류가 발생했습니다.",
    );
  }
}

// 챌린지 별 각 강의 과제 통계를 계산하는 함수
export async function getAssignmentStats(challengeId: number) {
  try {
    // 1. ChallengeLectures 테이블에서 challenge_id로 데이터 조회
    const { data: challengeLectures, error: challengeError } = (await supabase
      .from("ChallengeLectures")
      .select(
        `
        id,
        lecture_id,
        Lectures!inner (
          id,
          name
        )
      `,
      )
      .eq("challenge_id", challengeId)) as {
      data: ChallengeLecture[] | null;
      error: any;
    };

    if (challengeError) throw challengeError;

    // 2. 챌린지의 전체 참여자 수 조회
    const { data: challengeUsers, error: usersError } = await supabase
      .from("ChallengeUsers")
      .select("user_id")
      .eq("challenge_id", challengeId);

    if (usersError) throw usersError;
    const totalParticipants = challengeUsers.length;

    // 3. 각 강의별 제출 현황과 과제 정보 조회
    const submissionRates = await Promise.all(
      challengeLectures.map(async (lecture) => {
        // 과제 정보 조회
        const { data: assignment, error: assignmentError } = await supabase
          .from("Assignments")
          .select("title")
          .eq("lecture_id", lecture.lecture_id)
          .single();

        if (assignmentError) throw assignmentError;

        // 제출 현황 조회
        const { data: submissions, error: submissionError } = await supabase
          .from("Submissions")
          .select("user_id")
          .eq("challenge_lecture_id", lecture.id);

        if (submissionError) throw submissionError;

        const submittedCount = submissions.length;
        const submissionRate =
          totalParticipants > 0
            ? Math.round((submittedCount / totalParticipants) * 100)
            : 0;

        return {
          lectureId: lecture.lecture_id,
          lectureName: lecture.Lectures.name,
          totalParticipants,
          submittedCount,
          submissionRate,
          assignmentTitle: assignment?.title || "",
        };
      }),
    );

    return submissionRates;
  } catch (error) {
    console.error("과제 제출률 계산 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "과제 제출률 계산 중 오류가 발생했습니다.",
    );
  }
}
