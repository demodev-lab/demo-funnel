import { NextRequest, NextResponse } from "next/server";
import { studentsDataManager } from "@/lib/data/students-data";

// PUT /api/students/[id] - 학생 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, phone } = body;

    console.log(`PUT /api/students/${id} - 수정 요청:`, { name, email, phone }); // 디버깅

    // 입력값 검증
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 },
      );
    }

    // 학생 존재 여부 확인
    const existingStudent = studentsDataManager.findById(id);
    if (!existingStudent) {
      console.log(`PUT - 학생을 찾을 수 없음: ID=${id}`); // 디버깅
      return NextResponse.json(
        { error: "해당 학생을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 이메일 중복 검증 (자기 자신 제외)
    const duplicateStudent = studentsDataManager.findByEmail(email, id);
    if (duplicateStudent) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    // 학생 정보 업데이트
    const updatedStudent = studentsDataManager.update(id, {
      name,
      email,
      phone,
    });

    console.log(`PUT - 학생 수정 완료:`, updatedStudent); // 디버깅

    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      data: updatedStudent,
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

    console.log(`DELETE /api/students/${id} - 삭제 요청 받음`); // 디버깅

    // 삭제 전 현재 데이터 상태 확인
    studentsDataManager.debug();

    // 학생 존재 여부 확인 및 삭제
    const deletedStudent = studentsDataManager.delete(id);

    if (!deletedStudent) {
      console.log(`DELETE - 학생을 찾을 수 없음: ID=${id}`); // 디버깅
      return NextResponse.json(
        { error: "해당 학생을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    console.log(`DELETE - 학생 삭제 완료:`, deletedStudent); // 디버깅

    // 삭제 후 데이터 상태 확인
    console.log(
      `DELETE - 삭제 후 남은 학생 수:`,
      studentsDataManager.getAll().length,
    );

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
