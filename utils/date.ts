export const calculateLectureCount = (
  startDate: Date,
  endDate: Date,
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 시작일과 종료일을 포함하므로 +1
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("ko-KR");
};

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate > startDate;
};
