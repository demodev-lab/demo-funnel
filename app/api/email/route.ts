import { Resend } from "resend";
import { NextResponse } from "next/server";
import { EmailSendRequest } from "@/types/email";
import { EMAIL_TEMPLATES } from "@/constants/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body: EmailSendRequest = await request.json();
    const template = EMAIL_TEMPLATES[body.template];

    if (!template) {
      return NextResponse.json(
        { error: "유효하지 않은 템플릿입니다." },
        { status: 400 },
      );
    }

    const failedEmails: string[] = [];
    const successEmails: string[] = [];

    // 각 수신자에게 개별적으로 이메일 전송
    await Promise.all(
      body.to.map(async (email) => {
        try {
          // 사용자가 수정한 내용을 사용
          const content = body.variables.customContent.replace(
            "{name}",
            email.split("@")[0],
          ); // 이메일 앞부분을 이름으로 사용

          await resend.emails.send({
            from: "demo-funnel <onboarding@resend.dev>",
            to: [email],
            subject: template.subject,
            text: content,
          });

          successEmails.push(email);
        } catch (error) {
          console.error(`이메일 전송 실패 (${email}):`, error);
          failedEmails.push(email);
        }
      }),
    );

    if (failedEmails.length > 0) {
      return NextResponse.json({
        success: false,
        message: `${failedEmails.length}개의 이메일 전송에 실패했습니다.`,
        failedEmails,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${successEmails.length}개의 이메일이 성공적으로 전송되었습니다.`,
    });
  } catch (error) {
    console.error("이메일 전송 에러:", error);
    return NextResponse.json(
      { error: "이메일 전송 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
