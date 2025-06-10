import { EmailSendRequest, EmailSendResponse } from "@/types/email";

export const sendEmails = async (
  request: EmailSendRequest,
): Promise<EmailSendResponse> => {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("이메일 전송에 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.error("이메일 전송 에러:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "이메일 전송에 실패했습니다.",
    };
  }
};
