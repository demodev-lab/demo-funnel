import { supabase } from "./supabase";

// TODO 인터페이스 파일 분리 필요

interface Challenge {
  id: string;
  name: string;
}

interface ChallengeResponse {
  challenge_id: string;
  Challenges: {
    id: number;
    name: string;
  };
}

interface UserData {
  id?: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface UserWithChallenges extends UserData {
  challenges?: string[];
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
      const challengeUsers = challenges.map((challengeId: string) => ({
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

export async function updateUser(data: { id: string; [key: string]: any }) {
  try {
    // id 값 검증
    if (!data.id) {
      throw new Error("사용자 ID가 필요합니다.");
    }

    // id를 숫자로 변환
    const userId = parseInt(data.id, 10);
    if (isNaN(userId)) {
      throw new Error("유효하지 않은 사용자 ID입니다.");
    }

    // challenges 필드를 분리
    const { challenges, ...userData } = data;

    // 먼저 사용자가 존재하는지 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .single();

    if (checkError) throw checkError;
    if (!existingUser) {
      throw new Error(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`);
    }

    // Users 테이블 업데이트 (challenges 필드 제외)
    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ ...userData, id: userId })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 챌린지 업데이트 처리
    if (challenges && Array.isArray(challenges)) {
      // 기존 챌린지 삭제
      const { error: deleteError } = await supabase
        .from("ChallengeUsers")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // 새로운 챌린지 추가
      const challengeUsers = challenges.map((challengeId: string) => ({
        user_id: userId,
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

export async function deleteUser(userId: string) {
  try {
    // 먼저 해당 ID의 사용자가 존재하는지 확인
    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .single();

    if (checkError) throw checkError;
    if (!existingUser) {
      throw new Error(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`);
    }

    // ChallengeUsers 테이블에서 먼저 삭제
    const { error: challengeDeleteError } = await supabase
      .from("ChallengeUsers")
      .delete()
      .eq("user_id", userId);

    if (challengeDeleteError) throw challengeDeleteError;

    // Users 테이블에서 삭제
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

export async function getUserChallenges(userId: string): Promise<Challenge[]> {
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
      id: item.Challenges.id.toString(),
      name: item.Challenges.name,
    }));
  } catch (error) {
    console.error("챌린지 정보 조회 실패", error);
    return [];
  }
}

export async function getChallengeUsers(
  challengeId: string,
): Promise<UserData[]> {
  try {
    const { data, error } = await supabase
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

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.Users.id,
      name: item.Users.name,
      email: item.Users.email,
    }));
  } catch (error) {
    console.error("챌린지 수강생 정보 조회 실패", error);
    return [];
  }
}
