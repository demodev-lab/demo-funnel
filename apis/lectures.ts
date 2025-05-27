import { supabase } from "./supabase";

export async function getLectures() {
  try {
    const { data, error } = await supabase.from("Lectures").select("*");

    if (error) throw error;

    console.log("강의 목록: ", data);
    return data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function createLecture(data: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    // 1. Lectures 테이블에 강의 추가
    const { data: lecture, error: lectureError } = await supabase
      .from("Lectures")
      .insert({
        name: data.title,
        description: data.description,
        upload_type: 0,
        url: data.videoUrl,
      })
      .select()
      .single();

    if (lectureError) throw lectureError;

    // 2. 선택된 챌린지들을 ChallengeLectures 테이블에 추가
    if (data.challenges && data.challenges.length > 0) {
      const challengeLectures = data.challenges.map((challengeId: string) => ({
        lecture_id: lecture.id,
        challenge_id: challengeId,
      }));

      const { error: challengeError } = await supabase
        .from("ChallengeLectures")
        .insert(challengeLectures);

      if (challengeError) throw challengeError;
    }

    // 3. 과제가 있다면 Assignments 테이블에 추가
    if (data.assignment) {
      const { error: assignmentError } = await supabase
        .from("Assignments")
        .insert({
          lecture_id: lecture.id,
          title: data.assignment,
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // TODO: 과제 마감일 처리
        });

      if (assignmentError) throw assignmentError;
    }

    return lecture;
  } catch (error) {
    console.error("강의 추가 실패:", error);
    throw error;
  }
}

export async function updateLecture(lectureId: string, data: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    const { data: updatedLecture, error } = await supabase
      .from("Lectures")
      .update(data)
      .eq("id", lectureId)
      .select()
      .single();

    if (error) throw error;
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
