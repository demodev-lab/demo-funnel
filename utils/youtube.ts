interface Lecture {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  upload_type: number;
  sequence: number;
  assignment_title?: string;
  assignment?: string;
}

export const getYouTubeVideoId = (url: string) => {
  try {
    const parts = url.split("watch?v=");
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      return lastPart.split("/")[0].split("&")[0];
    }
    return null;
  } catch (e) {
    console.error("비디오 ID 추출 실패:", e);
    return null;
  }
};

export const getYouTubeThumbnailUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

export const getYouTubeEmbedUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export const getVideoThumbnailUrl = (lecture: Lecture) => {
  if (lecture.upload_type === 0) {
    const videoId = getYouTubeVideoId(lecture.url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  } else {
    return lecture.url;
  }
};
