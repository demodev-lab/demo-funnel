export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "방금 전";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}분 전`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}시간 전`;
  } else {
    const days = Math.floor(seconds / 86400);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (weeks < 2) {
      return `${days}일 전`;
    } else if (weeks === 2) {
      return "2주 전";
    } else if (weeks === 3) {
      return "3주 전";
    } else if (weeks === 4) {
      return "4주 전";
    } else if (days < 60) {
      return "1개월 전";
    } else if (days < 365) {
      return `${months}개월 전`;
    } else {
      return `${years}년 전`;
    }
  }
} 