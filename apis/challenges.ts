import { supabase } from "./supabase";

export interface ChallengeFormData {
  name: string;
  open_date: string;
  close_date: string;
  lecture_num: number;
}

export async function getChallenges() {
  try {
    const { data, error } = await supabase
      .from("Challenges")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    console.log("챌린지 목록: ", data);
    return data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    throw error;
  }
}

export async function createChallenge(data: ChallengeFormData) {
  try {
    const { data: newChallenge, error } = await supabase
      .from("Challenges")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newChallenge;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "챌린지 추가 중 오류가 발생했습니다.",
    );
  }
}

export async function updateChallenge(
  id: number,
  data: Partial<ChallengeFormData>,
) {
  try {
    const { data: updatedChallenge, error } = await supabase
      .from("Challenges")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!updatedChallenge) throw new Error("챌린지를 찾을 수 없습니다.");

    return updatedChallenge;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "챌린지 수정 중 오류가 발생했습니다.",
    );
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
    throw new Error(
      error instanceof Error
        ? error.message
        : "챌린지 삭제 중 오류가 발생했습니다.",
    );
  }
}
