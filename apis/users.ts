import axios from "axios";
import { supabase } from "./supabase";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export async function getUsers() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/Users`, {
      headers: {
        apikey: supabaseKey,
      },
    });
    console.log("데이터 패칭 성공", response.data);
    return response.data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function addUsers(data: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session);
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Users`,
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
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function updateUser(id: string, data: Omit<Student, "id">) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Users?id=eq.${id}`,
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
    return response.data[0]; // Supabase returns array with single item
  } catch (error) {
    console.error("수정 실패", error);
    throw error; // 에러를 상위로 전파하여 적절한 처리 가능하도록 함
  }
}
