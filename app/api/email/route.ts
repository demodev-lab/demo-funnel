import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { to, template, variables } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "이메일 서비스 설정이 완료되지 않았습니다." },
        { status: 500 },
      );
    }

    let subject = "";
    let content = "";

    switch (template) {
      case "lecture-open":
        subject = "새로운 강의가 오픈되었습니다!";
        content = `안녕하세요, ${variables.name}님!\n\n코드언락의 새로운 강의가 오픈되었습니다. 지금 바로 확인해보세요.\n\n강의명: ${variables.lectureName}\n오픈일: ${variables.openDate}\n\n코드언락 드림`;
        break;
      case "assignment-reminder":
        subject = "미제출 과제 알림";
        content = `안녕하세요, ${variables.name}님!\n\n아직 제출하지 않은 과제가 있습니다. 기한 내에 제출해주세요.\n\n과제명: ${variables.assignmentName}\n제출기한: ${variables.dueDate}\n\n코드언락 드림`;
        break;
    }

    console.log("이메일 전송 시도:", {
      to,
      subject,
      template,
      variables,
    });

    const data = await resend.emails.send({
      from: "CodeUnlock <onboarding@resend.dev>", // 테스트를 위해 Resend의 기본 도메인 사용
      to,
      subject,
      react: content.replace(/\n/g, "<br>"),
    });

    console.log("이메일 전송 결과:", data);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("이메일 전송 에러:", {
      error,
      message: error.message,
      response: error.response,
    });

    return NextResponse.json(
      {
        error: "이메일 전송 중 오류가 발생했습니다.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
