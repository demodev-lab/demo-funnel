import { supabase } from "./supabase";
import type { ChallengeFormData, UserChallenges } from "@/types/challenge";
import { handleError } from "@/utils/errorHandler";

export async function getChallenges() {
  try {
    const { data, error } = await supabase
      .from("Challenges")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      openDate: challenge.open_date,
      closeDate: challenge.close_date,
      lectureNum: challenge.lecture_num,
    }));
  } catch (error) {
    handleError(error, "챌린지 목록 조회 중 오류가 발생했습니다.");
  }
}

export async function createChallenge(data: ChallengeFormData) {
  const { openDate, closeDate, lectureNum, ...rest } = data;
  const payload = {
    ...rest,
    open_date: openDate,
    close_date: closeDate,
    lecture_num: lectureNum,
  };

  try {
    const { data: newChallenge, error } = await supabase
      .from("Challenges")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return newChallenge;
  } catch (error) {
    handleError(error, "챌린지 추가 중 오류가 발생했습니다.");
  }
}

export async function updateChallenge(
  id: number,
  data: Partial<ChallengeFormData>,
) {
  try {
    const { openDate, closeDate, lectureNum, ...rest } = data;
    const payload = {
      ...rest,
      open_date: openDate,
      close_date: closeDate,
      lecture_num: lectureNum,
    };

    const { data: updatedChallenge, error } = await supabase
      .from("Challenges")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!updatedChallenge) throw new Error("챌린지를 찾을 수 없습니다.");

    // 챌린지의 open_date가 변경되었는지 확인
    if (data.openDate) {
      // 해당 챌린지의 모든 강의 조회
      const { data: lectures, error: lectureError } = await supabase
        .from("ChallengeLectures")
        .select("*")
        .eq("challenge_id", id)
        .order("sequence", { ascending: true });

      if (lectureError) throw lectureError;

      // 각 강의의 날짜 업데이트
      for (const lecture of lectures) {
        const openAt = new Date(data.openDate);
        openAt.setDate(openAt.getDate() + (lecture.sequence - 1));

        const dueAt = new Date(openAt);
        dueAt.setDate(dueAt.getDate() + 1);

        const { error: updateError } = await supabase
          .from("ChallengeLectures")
          .update({
            open_at: openAt.toISOString(),
            due_at: dueAt.toISOString(),
          })
          .eq("id", lecture.id);

        if (updateError) throw updateError;
      }
    }

    return updatedChallenge;
  } catch (error) {
    handleError(error, "챌린지 수정 중 오류가 발생했습니다.");
  }
}

export async function deleteChallenge(id: number) {
  try {
    // 먼저 ChallengeLectures 테이블에서 관련 데이터 삭제
    const { error: lectureError } = await supabase
      .from("ChallengeLectures")
      .delete()
      .eq("challenge_id", id);

    if (lectureError) throw lectureError;

    // 그 다음 Challenge 삭제
    const { error: challengeError } = await supabase
      .from("Challenges")
      .delete()
      .eq("id", id);

    if (challengeError) throw challengeError;

    return true;
  } catch (error) {
    handleError(error, "챌린지 삭제 중 오류가 발생했습니다.");
  }
}

export async function getUserChallenges(
  userId: number,
): Promise<UserChallenges[]> {
  try {
    const { data, error } = await supabase
      .from("ChallengeUsers")
      .select(
        `
        id,
        Challenges (
          id,
          name
        )
      `,
      )
      .eq("user_id", userId)
      .order("challenge_id", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.Challenges.id,
      name: item.Challenges.name,
    }));
  } catch (error) {
    handleError(error, "챌린지 정보 조회 실패");
    return [];
  }
}

export async function getChallengeName(
  challengeId: number,
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("Challenges")
      .select("name")
      .eq("id", challengeId)
      .single();

    if (error) throw error;

    return data?.name || null;
  } catch (error) {
    handleError(error, "챌린지명 조회 중 오류가 발생했습니다.");
    return null;
  }
}
