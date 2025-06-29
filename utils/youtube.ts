export const getYouTubeVideoId = (url: string) => {
  try {
    // youtu.be 형식 처리
    if (url.includes("youtu.be")) {
      const parts = url.split("youtu.be/");
      if (parts.length > 1) {
        return parts[1].split("?")[0];
      }
    }

    // watch?v= 형식 처리
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

export const getVideoThumbnailUrl = (upload_type: number, url: string) => {
  if (upload_type === 0) {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  } else {
    return "https://placehold.co/1280x720/1A1D29/8C7DFF?text=No+Thumbnail";
  }
};
