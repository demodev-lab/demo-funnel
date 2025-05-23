import { NextRequest, NextResponse } from "next/server";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// 임시 데이터 (실제로는 데이터베이스에서 가져와야 함)
let students: Student[] = [
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

// GET /api/students - 학생 목록 조회
export async function GET() {
  try {
    // 실제로는 데이터베이스에서 조회
    // const students = await db.students.findMany();

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      data: students,
      message: "학생 목록을 성공적으로 조회했습니다.",
    });
  } catch (error) {
    console.error("학생 목록 조회 실패:", error);
    return NextResponse.json(
      { error: "학생 목록을 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/students - 학생 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // 입력값 검증
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 },
      );
    }

    // 이메일 중복 검증
    const existingStudent = students.find((student) => student.email === email);
    if (existingStudent) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    // 새 학생 생성
    const newId = (
      Math.max(...students.map((s) => parseInt(s.id))) + 1
    ).toString();
    const newStudent: Student = {
      id: newId,
      name,
      email,
      phone,
    };

    students.push(newStudent);

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(
      {
        data: newStudent,
        message: "학생이 성공적으로 추가되었습니다.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("학생 추가 실패:", error);
    return NextResponse.json(
      { error: "학생 추가에 실패했습니다." },
      { status: 500 },
    );
  }
}
