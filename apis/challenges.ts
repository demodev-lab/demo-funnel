import axios from "axios";
import { supabase } from "./supabase";

export interface ChallengeFormData {
  name: string;
  open_date: string;
  close_date: string;
  lecture_num: number;
}

export async function getChallenges() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/Challenges`, {
      headers: {
        apikey: supabaseKey,
      },
    });
    console.log("챌린지 목록: ", response.data);
    return response.data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    throw error;
  }
}

export async function addChallenge(data: ChallengeFormData) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Challenges`,
      data,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "챌린지 추가 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
}

export async function deleteChallenge(id: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Challenges?id=eq.${id}`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 204) {
      return true;
    }

    throw new Error("챌린지 삭제에 실패했습니다.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "챌린지 삭제 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
}

export async function updateChallenge(
  id: string,
  data: Partial<ChallengeFormData>,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Challenges?id=eq.${id}`,
      data,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      },
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("챌린지를 찾을 수 없습니다.");
    }

    return response.data[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "챌린지 수정 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
}
