import { NextRequest, NextResponse } from "next/server";
import { studentsDataManager, type Student } from "@/lib/data/students-data";

// 공통 데이터 모듈에서 타입 재내보내기
export type { Student } from "@/lib/data/students-data";

// GET /api/students - 학생 목록 조회
export async function GET() {
  try {
    // 공통 데이터 매니저에서 조회
    const students = studentsDataManager.getAll();

    console.log("GET /api/students - 현재 학생 수:", students.length); // 디버깅

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
    const existingStudent = studentsDataManager.findByEmail(email);
    if (existingStudent) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    // 새 학생 추가
    const newStudent = studentsDataManager.add({ name, email, phone });

    console.log("POST /api/students - 새 학생 추가:", newStudent); // 디버깅

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
