import { supabase } from "./supabase";

interface Challenge {
  id: string;
  name: string;
}

interface ChallengeLectureResponse {
  challenge_id: string;
  Challenges: Challenge;
}

interface LectureChallenge {
  Challenges: {
    id: string;
    name: string;
  };
}

export interface CreateLectureData {
  title: string;
  description: string;
  url: string;
  challenges: string[];
  assignment?: string;
}

export interface UpdateLectureData {
  name: string;
  description: string;
  url: string;
  challenges: string[];
}

export async function getLectures() {
  try {
    const { data, error } = await supabase
      .from("Lectures")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    console.log("강의 목록: ", data);
    return data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function createLecture(data: CreateLectureData) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    console.log("강의 생성 시도:", data);

    // Lectures 테이블에 강의 추가
    const { data: lecture, error: lectureError } = await supabase
      .from("Lectures")
      .insert([
        {
          name: data.title,
          description: data.description,
          url: data.url,
          upload_type: 0, // URL 방식
        },
      ])
      .select()
      .single();

    if (lectureError) {
      console.error("강의 추가 에러:", lectureError);
      throw lectureError;
    }

    console.log("생성된 강의:", lecture);

    // 선택된 챌린지들을 ChallengeLectures 테이블에 추가
    if (data.challenges && data.challenges.length > 0) {
      const challengeLectures = data.challenges.map((challengeId) => ({
        lecture_id: lecture.id,
        challenge_id: challengeId,
      }));

      const { error: challengeError } = await supabase
        .from("ChallengeLectures")
        .insert(challengeLectures);

      if (challengeError) {
        console.error("챌린지 연결 에러:", challengeError);
        throw challengeError;
      }
    }

    return lecture;
  } catch (error) {
    console.error("강의 추가 실패:", error);
    throw error;
  }
}

export async function updateLecture(
  lectureId: string,
  data: UpdateLectureData,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    console.log("수정 요청 데이터:", data);

    // 강의 정보 업데이트
    const { data: updatedLecture, error: lectureError } = await supabase
      .from("Lectures")
      .update({
        name: data.name,
        description: data.description,
        url: data.url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lectureId)
      .select()
      .single();

    if (lectureError) {
      console.error("강의 수정 에러:", lectureError);
      throw lectureError;
    }

    // 기존 챌린지 연결 정보 삭제
    const { error: deleteError } = await supabase
      .from("ChallengeLectures")
      .delete()
      .eq("lecture_id", lectureId);

    if (deleteError) {
      console.error("기존 챌린지 연결 삭제 에러:", deleteError);
      throw deleteError;
    }

    // 새로운 챌린지 연결 정보 추가
    if (data.challenges && data.challenges.length > 0) {
      const challengeLectures = data.challenges.map((challengeId: string) => ({
        lecture_id: lectureId,
        challenge_id: challengeId,
      }));

      const { error: insertError } = await supabase
        .from("ChallengeLectures")
        .insert(challengeLectures);

      if (insertError) {
        console.error("새로운 챌린지 연결 추가 에러:", insertError);
        throw insertError;
      }
    }

    console.log("수정된 강의:", updatedLecture);
    return updatedLecture;
  } catch (error) {
    console.error("강의 업데이트 실패", error);
    throw error;
  }
}

export async function deleteLecture(lectureId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    // 먼저 해당 ID의 강의가 존재하는지 확인
    const { data: lecture, error: checkError } = await supabase
      .from("Lectures")
      .select("id")
      .eq("id", lectureId)
      .single();

    if (checkError || !lecture) {
      throw new Error(`ID가 ${lectureId}인 강의를 찾을 수 없습니다.`);
    }

    // 강의 삭제
    const { error: deleteError } = await supabase
      .from("Lectures")
      .delete()
      .eq("id", lectureId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error("강의 삭제 실패", error);
    throw error;
  }
}

export async function getLectureChallenges(
  lectureId: string,
): Promise<Challenge[]> {
  try {
    const { data, error } = await supabase
      .from("ChallengeLectures")
      .select(
        `
        challenge_id,
        Challenges (
          id,
          name
        )
      `,
      )
      .eq("lecture_id", lectureId)
      .returns<{ challenge_id: string; Challenges: Challenge }[]>();

    if (error) throw error;

    // Challenges 테이블의 데이터만 추출
    const challenges = data?.map((item) => item.Challenges) || [];
    console.log("강의 챌린지 목록:", challenges);

    return challenges;
  } catch (error) {
    console.error("챌린지 데이터 조회 실패:", error);
    return [];
  }
}
