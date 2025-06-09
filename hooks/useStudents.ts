import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getChallengeUsers,
} from "@/apis/users";
import { User } from "@/types/user";

// 공통 데이터 모듈에서 타입 가져오기
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  challenges?: number[];
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface ApiError {
  error: string;
}

type StudentInput = Omit<Student, "id">;

// API 함수들
const studentsApi = {
  // 학생 목록 조회
  getStudents: async (): Promise<Student[]> => {
    try {
      const data = await getUsers();
      return data;
    } catch (error) {
      throw new Error("학생 목록을 불러오는데 실패했습니다.");
    }
  },

  // 학생 추가
  createStudent: async (studentData: StudentInput): Promise<Student> => {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "학생 추가에 실패했습니다.");
    }

    const result: ApiResponse<Student> = await response.json();
    return result.data;
  },

  // 학생 수정
  updateStudent: async ({ id, ...studentData }: Student): Promise<Student> => {
    const response = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "학생 정보 수정에 실패했습니다.");
    }

    const result: ApiResponse<Student> = await response.json();
    return result.data;
  },

  // 학생 삭제
  deleteStudent: async (id: number): Promise<Student> => {
    console.log(`deleteStudent 호출됨: ID=${id}`); // 디버깅

    try {
      await deleteUser(id);
      // 삭제된 학생 정보를 반환 (실제로는 null이 반환될 수 있음)
      return { id: 0, name: "", email: "", phone: "" };
    } catch (error) {
      console.error(`DELETE 실패:`, error); // 디버깅
      throw new Error(
        error instanceof Error ? error.message : "학생 삭제에 실패했습니다.",
      );
    }
  },
};

// React Query 훅들
export const useStudents = () => {
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: getUsers,
  });
};

export function useStudentsByChallenge(challengeId: number | null) {
  return useInfiniteQuery({
    queryKey: ["students", challengeId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!challengeId) return { data: [], total: 0 };
      return getChallengeUsers(challengeId, pageParam, 10);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < 10) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!challengeId,
  });
}

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentInput) => createUser(data),
    onSuccess: () => {
      // 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", "byChallenges"] });
    },
  });
};

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (student: Student) => {
      // Student 타입의 id를 number로 변환
      const updatedStudent = {
        ...student,
        id: Number(student.id),
        challenges: student.challenges?.map(Number),
      };
      return updateUser(updatedStudent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", "byChallenges"] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await deleteUser(id);
        return { id: 0, name: "", email: "", phone: "" };
      } catch (error) {
        console.error(`DELETE 실패:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
