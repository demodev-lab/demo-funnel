import axios from "axios";

let cachedServerTime: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1분

/**
 * 서버 시간을 가져옵니다 (KST 기준).
 * 1분 동안 캐시를 사용합니다.
 */
export const getServerTime = async (): Promise<string> => {
  const now = Date.now();

  if (cachedServerTime && now - lastFetchTime < CACHE_DURATION) {
    return cachedServerTime;
  }

  try {
    const { data } = await axios.get("/api/server-time");
    cachedServerTime = data.serverTime;
    lastFetchTime = now;
    return data.serverTime;
  } catch (error) {
    console.error("서버 시간을 가져오는데 실패했습니다:", error);
    return new Date().toISOString(); // 실패 시 클라이언트 시간 사용
  }
};

/**
 * 오늘 날짜의 강의인지 확인합니다 (과제 제출 조건 확인용).
 * - 서버 날짜가 openAt 날짜와 같으면 true
 *
 * 예:
 * - 서버 시간: 6월 10일 → openAt: 6월 10일 → ✅ true
 * - 서버 시간: 6월 10일 → openAt: 6월 9일  → ❌ false
 */
export const checkIsTodayLecture = async (openAt: string): Promise<boolean> => {
  if (!openAt) return false;

  const serverTime = await getServerTime();
  const serverDate = new Date(serverTime.split("T")[0]);
  const openDate = new Date(openAt.split("T")[0]);

  return serverDate.getTime() === openDate.getTime();
};

/**
 * 현재 시점에 강의가 열렸는지 확인합니다 (강의 시청 조건 확인용).
 * - 서버 시간이 openAt보다 같거나 늦으면 true
 *
 * 예:
 * - 서버 시간: 6월 9일 00:00 → openAt: 6월 9일 00:00 → ✅ true
 * - 서버 시간: 6월 8일 23:59 → openAt: 6월 9일 00:00 → ❌ false
 */
export const isLectureOpen = async (openAt: string): Promise<boolean> => {
  if (!openAt) return false;

  const serverTime = await getServerTime();
  return new Date(serverTime) >= new Date(openAt);
};
