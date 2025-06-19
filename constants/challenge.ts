export const CHALLENGE_COLUMNS = [
  { header: "기수 이름", accessor: "name" },
  {
    header: "시작일",
    accessor: "openDate",
    cell: (value: string) => new Date(value).toLocaleDateString("ko-KR"),
  },
  {
    header: "종료일",
    accessor: "closeDate",
    cell: (value: string) => new Date(value).toLocaleDateString("ko-KR"),
  },
  {
    header: "강의 개수",
    accessor: "lectureNum",
    cell: (value: number) => `${value}개`,
  },
];

export const CHALLENGE_MESSAGES = {
  LOADING: "챌린지 목록을 불러오는 중...",
  EMPTY: "등록된 챌린지가 없습니다.",
  ERROR: "오류가 발생했습니다",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  VALIDATION: {
    REQUIRED: "모든 필수 항목을 입력해주세요.",
    DATE_RANGE: "종료일은 시작일보다 늦어야 합니다.",
    LECTURE_COUNT: "강의 개수는 1개 이상이어야 합니다.",
  },
  SUCCESS: {
    CREATE: "챌린지가 성공적으로 추가되었습니다.",
    UPDATE: "챌린지가 성공적으로 수정되었습니다.",
    DELETE: "챌린지가 성공적으로 삭제되었습니다.",
  },
  ERROR_MESSAGE: {
    CREATE: "챌린지 추가 중 오류가 발생했습니다.",
    UPDATE: "챌린지 수정 중 오류가 발생했습니다.",
    DELETE: "챌린지 삭제 중 오류가 발생했습니다.",
  },
  CONFIRM_DELETE: "정말로 이 챌린지를 삭제하시겠습니까?",
};
