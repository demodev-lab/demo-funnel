import { supabase } from "./supabase";

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .order("created_at", { ascending: true }); // 오름차순 정렬

    if (error) throw error;
    console.log("데이터 패칭 성공", data);
    return data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function createUser(data: any) {
  try {
    const { data: newUser, error } = await supabase
      .from("Users")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newUser;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
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

    // 사용자가 존재하면 업데이트 실행
    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update({ ...data, id: userId })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;
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

    const { error: deleteError } = await supabase
      .from("Users")
      .delete()
      .eq("id", userId);

    if (deleteError) throw deleteError;
    return { success: true };
  } catch (error) {
    console.error("사용자 삭제 실패", error);
    throw error;
  }
}
