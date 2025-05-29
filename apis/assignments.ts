import { supabase } from "./supabase";

export async function getAssignment(lectureId: string) {
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
  challengeLectureId: string;
  userId: string;
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
