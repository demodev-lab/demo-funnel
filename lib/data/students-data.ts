export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  challenges?: string[];
}

// 메모리 내 학생 데이터 (실제로는 데이터베이스를 사용해야 함)
let studentsData: Student[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    phone: "010-2345-6789",
  },
  {
    id: "3",
    name: "박지민",
    email: "park@example.com",
    phone: "010-3456-7890",
  },
];

// 학생 데이터 관리 함수들
export const studentsDataManager = {
  // 모든 학생 조회
  getAll: (): Student[] => {
    return [...studentsData]; // 복사본 반환
  },

  // ID로 학생 찾기
  findById: (id: string): Student | undefined => {
    return studentsData.find((student) => student.id === id);
  },

  // 이메일로 학생 찾기 (중복 검사용)
  findByEmail: (email: string, excludeId?: string): Student | undefined => {
    return studentsData.find(
      (student) => student.email === email && student.id !== excludeId,
    );
  },

  // 학생 추가
  add: (studentData: Omit<Student, "id">): Student => {
    const newId = (
      Math.max(...studentsData.map((s) => parseInt(s.id)), 0) + 1
    ).toString();
    const newStudent: Student = {
      id: newId,
      ...studentData,
    };
    studentsData.push(newStudent);
    return newStudent;
  },

  // 학생 수정
  update: (id: string, studentData: Omit<Student, "id">): Student | null => {
    const studentIndex = studentsData.findIndex((student) => student.id === id);
    if (studentIndex === -1) {
      return null;
    }

    const updatedStudent: Student = {
      id,
      ...studentData,
    };
    studentsData[studentIndex] = updatedStudent;
    return updatedStudent;
  },

  // 학생 삭제
  delete: (id: string): Student | null => {
    const studentIndex = studentsData.findIndex((student) => student.id === id);
    if (studentIndex === -1) {
      return null;
    }

    const deletedStudent = studentsData.splice(studentIndex, 1)[0];
    return deletedStudent;
  },

  // 현재 데이터 확인 (디버깅용)
  debug: () => {
    console.log("현재 학생 데이터:", studentsData);
    return studentsData;
  },
};
