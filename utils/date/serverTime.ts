import axios from "axios";

let cachedServerTime: Date | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1분

/**
 * 서버 시간을 가져옵니다 (KST 기준).
 * 1분 동안 캐시를 사용합니다.
 */ 
export const getServerTime = async (): Promise<Date> => {
  const now = Date.now();

  // 캐시 확인 ( 타입도 Date로 통일 )
  if (cachedServerTime && now - lastFetchTime < CACHE_DURATION) {
    return cachedServerTime; // 이미 Date 객체  
  }

  try {
    const baseUrl = typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      : "";
    const { data } = await axios.get(`${baseUrl}/api/server-time`);
    
    // Date로 반환해서 캐시
    cachedServerTime = new Date(data.serverTime);
    lastFetchTime = now;
    return cachedServerTime;
  } catch (error) {
    console.error("서버 시간을 가져오는데 실패했습니다:", error);
    return new Date();
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

  const serverDate = await getServerTime();
  
  return serverDate.toDateString() === new Date(openAt).toDateString();
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

  const serverDate = await getServerTime();
  return serverDate >= new Date(openAt);
};

/**
 * 여러 강의 중에서 오늘 날짜의 가장 최근 강의를 찾습니다.
 * 서버 시간을 한 번만 가져와서 효율적으로 처리합니다.
 * 
 * @param lectures 강의 목록 (open_at 기준 오름차순 정렬)
 * @returns 오늘 날짜의 가장 최근 강의 인덱스, 없으면 -1
 */
export const findTodayLectureIndex = async (lectures: Array<{ open_at: string }>): Promise<number> => {
  if (!lectures || lectures.length === 0) return -1;

  const serverDate = await getServerTime();
  const serverDateString = serverDate.toDateString();
  
  // NOTE: 강의 수가 많아지면 서버에서 미리 처리해야 함
  for (let i = lectures.length - 1; i >= 0; i--) {
    const openDateString = new Date(lectures[i].open_at).toDateString();
    
    if (serverDateString === openDateString) {
      return i;
    }
  }
  
  return -1;
};

