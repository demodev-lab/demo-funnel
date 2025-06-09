import axios from "axios";

let cachedServerTime: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1분

// 테스트용 서버 시간 설정 함수
let testServerTime: string | null = null;
export const setTestServerTime = (time: string | null) => {
  testServerTime = time;
};

/**
 * 서버 시간을 가져옵니다. 캐시된 시간이 있으면 그것을 사용합니다.
 */
export const getServerTime = async (): Promise<string> => {
  // 테스트 모드일 때는 테스트 시간 반환
  if (testServerTime) {
    return testServerTime;
  }

  const now = Date.now();
  
  // 캐시된 시간이 있고, 캐시 시간이 1분 이내라면 캐시된 시간 사용
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
    // 에러 발생 시 현재 시간 반환
    return new Date().toISOString();
  }
};

/**
 * open_at을 비교하여 오늘 오픈된 강의/과제인지 확인
 * @param openAt 오픈 시간 (ISO 문자열)
 * @returns boolean
 */
export const isTodayOpen = async (openAt: string): Promise<boolean> => {
  if (!openAt) return false;
  
  const serverTime = await getServerTime();
  const serverDate = new Date(serverTime.split("T")[0]);
  const openDate = new Date(openAt.split("T")[0]);
  
  return serverDate.getTime() === openDate.getTime();
};

/**
 * open_at을 비교하여 강의/과제가 오픈되었는지 확인
 * @param openAt 오픈 시간 (ISO 문자열)
 * @returns boolean
 */
export const isOpen = async (openAt: string): Promise<boolean> => {
  if (!openAt) return false;
  
  const serverTime = await getServerTime();
  return new Date(serverTime) >= new Date(openAt);
}; 