import { NextRequest, NextResponse } from "next/server";
import { Student } from "../route";

// 임시 데이터 (실제로는 데이터베이스에서 가져와야 함)
// 주의: 실제 앱에서는 데이터베이스를 사용해야 합니다
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

// PUT /api/students/[id] - 학생 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, phone } = body;

    // 입력값 검증
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 },
      );
    }

    // 학생 찾기
    const studentIndex = students.findIndex((student) => student.id === id);
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: "해당 학생을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 이메일 중복 검증 (자기 자신 제외)
    const existingStudent = students.find(
      (student) => student.email === email && student.id !== id,
    );
    if (existingStudent) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    // 학생 정보 업데이트
    students[studentIndex] = {
      id,
      name,
      email,
      phone,
    };

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      data: students[studentIndex],
      message: "학생 정보가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error("학생 수정 실패:", error);
    return NextResponse.json(
      { error: "학생 정보 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/students/[id] - 학생 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // 학생 찾기
    const studentIndex = students.findIndex((student) => student.id === id);
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: "해당 학생을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 학생 삭제
    const deletedStudent = students.splice(studentIndex, 1)[0];

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      data: deletedStudent,
      message: "학생이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("학생 삭제 실패:", error);
    return NextResponse.json(
      { error: "학생 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
