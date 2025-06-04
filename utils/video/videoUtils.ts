// YouTube 비디오 ID 추출 함수
export const getYouTubeVideoId = (url: string) => {
  try {
    // URL에서 마지막 v= 파라미터를 찾습니다
    const parts = url.split("watch?v=");
    if (parts.length > 1) {
      // 마지막 부분을 가져옵니다
      const lastPart = parts[parts.length - 1];
      // 추가 파라미터가 있다면 제거
      return lastPart.split("/")[0].split("&")[0];
    }
    return null;
  } catch (e) {
    // console.error("비디오 ID 추출 실패:", e);
    return null;
  }
};

export const getYouTubeEmbedUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export const getVideoThumbnailUrl = (upload_type: number, url: string) => {
  if (upload_type === 0) {
    // YouTube 동영상인 경우
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  } else {
    return "https://placehold.co/1280x720/1A1D29/8C7DFF?text=No+Thumbnail";
  }
};

// URL에서 업로드 타입 (0: YouTube, 1: 직접 업로드)을 가져오는 함수
export const getUploadTypeFromUrl = (url: string): number => {
  return url.includes('youtube.com') ? 0 : 1;
};