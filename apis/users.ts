import { supabase } from "./supabase";

// TODO 인터페이스 파일 분리 필요

interface Challenge {
  id: number;
  name: string;
}

interface ChallengeResponse {
  challenge_id: number;
  Challenges: {
    id: number;
    name: string;
  };
}

export interface UserData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  [key: string]: any;
}

interface UserWithChallenges extends UserData {
  challenges?: number[];
}

interface SubmissionStatus {
  lectureId: number;
  isSubmitted: boolean;
  assignments?: {
    url: string;
    comment: string;
  }[];
}

interface ChallengeUserResponse {
  user_id: string;
  Users: {
    id: string;
    name: string;
    email: string;
  };
}

interface ChallengeLecture {
  id: number;
  lecture_id: number;
}

interface StudentSubmission {
  userId: string;
  userName: string;
  userEmail: string;
  submissions: SubmissionStatus[];
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function createUser(data: UserWithChallenges) {
  try {
    const { challenges, ...userData } = data;

    const { data: newUser, error: userError } = await supabase
      .from("Users")
      .insert(userData)
      .select()
      .single();

    if (userError) throw userError;

    if (challenges && Array.isArray(challenges)) {
      const challengeUsers = challenges.map((challengeId: number) => ({
        user_id: newUser.id,
        challenge_id: challengeId,
        enrolled_at: new Date().toISOString(),
      }));

      const { error: challengeError } = await supabase
        .from("ChallengeUsers")
        .insert(challengeUsers);

      if (challengeError) throw challengeError;
    }

    return newUser;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    throw error;
  }
}

export async function updateUser(data: { id: number; [key: string]: any }) {
  try {
    if (!data.id) {
      throw new Error("사용자 ID가 필요합니다.");
    }

    const { challenges, ...userData } = data;

    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", data.id)
      .single();

    if (checkError) throw checkError;
    if (!existingUser) {
      throw new Error(`ID가 ${data.id}인 사용자를 찾을 수 없습니다.`);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update(userData)
      .eq("id", data.id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (challenges && Array.isArray(challenges)) {
      const { error: deleteError } = await supabase
        .from("ChallengeUsers")
        .delete()
        .eq("user_id", data.id);

      if (deleteError) throw deleteError;

      const challengeUsers = challenges.map((challengeId: number) => ({
        user_id: data.id,
        challenge_id: challengeId,
        enrolled_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("ChallengeUsers")
        .insert(challengeUsers);

      if (insertError) throw insertError;
    }

    return updatedUser;
  } catch (error) {
    console.error("사용자 업데이트 실패", error);
    throw error;
  }
}

export async function deleteUser(userId: number) {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .single();

    if (checkError) throw checkError;
    if (!existingUser) {
      throw new Error(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`);
    }

    const { error: challengeDeleteError } = await supabase
      .from("ChallengeUsers")
      .delete()
      .eq("user_id", userId);

    if (challengeDeleteError) throw challengeDeleteError;

    const { error: userDeleteError } = await supabase
      .from("Users")
      .delete()
      .eq("id", userId);

    if (userDeleteError) throw userDeleteError;

    return { success: true };
  } catch (error) {
    console.error("사용자 삭제 실패", error);
    throw error;
  }
}

export async function getUserChallenges(userId: number): Promise<Challenge[]> {
  try {
    const { data, error } = await supabase
      .from("ChallengeUsers")
      .select(
        `
        challenge_id,
        Challenges (
          id,
          name
        )
      `,
      )
      .eq("user_id", userId);

    if (error) throw error;

    return (data as unknown as ChallengeResponse[]).map((item) => ({
      id: item.Challenges.id,
      name: item.Challenges.name,
    }));
  } catch (error) {
    console.error("챌린지 정보 조회 실패", error);
    return [];
  }
}

export async function getChallengeUsers(
  challengeId: number,
): Promise<UserData[]> {
  try {
    if (!challengeId) {
      return [];
    }

    const { data, error } = await supabase
      .from("ChallengeUsers")
      .select(
        `
        user_id,
        Users (
          id,
          name,
          email,
          phone,
          created_at
        )
      `,
      )
      .eq("challenge_id", challengeId)
      .order("Users(created_at)", { ascending: true });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.Users.id,
      name: item.Users.name,
      email: item.Users.email,
      phone: item.Users.phone || "",
    }));
  } catch (error) {
    console.error("챌린지 수강생 정보 조회 실패", error);
    return [];
  }
}

export async function getStudentSubmissions(
  challengeId: string,
): Promise<StudentSubmission[]> {
  try {
    // 1. ChallengeUsers 조회하여 해당 챌린지의 수강생 목록 가져오기
    const { data: challengeUsers, error: challengeUsersError } = await supabase
      .from("ChallengeUsers")
      .select(
        `
        user_id,
        Users (
          id,
          name,
          email
        )
      `,
      )
      .eq("challenge_id", challengeId);

    if (challengeUsersError) throw challengeUsersError;

    // 2. ChallengeLectures 조회하여 해당 챌린지의 강의 목록 가져오기
    const { data: challengeLectures, error: challengeLecturesError } =
      await supabase
        .from("ChallengeLectures")
        .select("id, lecture_id")
        .eq("challenge_id", challengeId)
        .order("sequence", { ascending: true });

    if (challengeLecturesError) throw challengeLecturesError;

    // 3. 각 수강생별로 제출 여부 확인
    const studentSubmissions = await Promise.all(
      (challengeUsers || []).map(async (user: any) => {
        // 각 강의별 제출 여부 조회
        const submissions = await Promise.all(
          (challengeLectures || []).map(async (lecture: ChallengeLecture) => {
            const { data: submissions, error: submissionError } = await supabase
              .from("Submissions")
              .select("is_submit, assignment_url, assignment_comment")
              .eq("user_id", user.user_id)
              .eq("challenge_lecture_id", lecture.id);

            if (submissionError) throw submissionError;

            const isSubmitted =
              submissions?.some((sub) => sub.is_submit) ?? false;
            const assignments =
              submissions
                ?.filter((sub) => sub.is_submit)
                .map((sub) => ({
                  url: sub.assignment_url,
                  comment: sub.assignment_comment,
                })) ?? [];

            return {
              lectureId: lecture.lecture_id,
              isSubmitted,
              assignments: assignments.length > 0 ? assignments : undefined,
            };
          }),
        );

        return {
          userId: user.user_id,
          userName: user.Users.name,
          userEmail: user.Users.email,
          submissions,
        };
      }),
    );

    return studentSubmissions;
  } catch (error) {
    console.error("수강생 제출 현황 조회 실패:", error);
    throw error;
  }
}
