import axios from "axios";
import { supabase } from "./supabase";

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
