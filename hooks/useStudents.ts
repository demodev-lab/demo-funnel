import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
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
    const response = await fetch("/api/students");

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "학생 목록을 불러오는데 실패했습니다.");
    }

    const result: ApiResponse<Student[]> = await response.json();
    return result.data;
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
      method: "PUT",
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
  deleteStudent: async (id: string): Promise<Student> => {
    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || "학생 삭제에 실패했습니다.");
    }

    const result: ApiResponse<Student> = await response.json();
    return result.data;
  },
};

// React Query 훅들
export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentsApi.getStudents,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.createStudent,
    onSuccess: () => {
      // 학생 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.updateStudent,
    onSuccess: () => {
      // 학생 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      // 학생 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
