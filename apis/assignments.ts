import { supabase } from "./supabase";

export async function getAssignment(lectureId: string) {
  try {
    const { data: assignment, error } = await supabase
      .from("Assignments")
      .select("*")
      .eq("lecture_id", lectureId)
      .order("created_at", { ascending: true });

    if (error) throw error;

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
