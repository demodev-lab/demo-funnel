import { EmailTemplate } from "@/types/email";

export const EMAIL_TEMPLATES: Record<EmailTemplate["id"], EmailTemplate> = {
  "lecture-open": {
    id: "lecture-open",
    subject: "새로운 강의가 오픈되었습니다!",
    content: `안녕하세요, {name}님!

demo-funnel의 새로운 강의가 오픈되었습니다.
지금 확인해보세요.

https://demodev-funnel.vercel.app/

demo-funnel 드림`,
  },
  "assignment-reminder": {
    id: "assignment-reminder",
    subject: "과제 제출 마감이 다가옵니다",
    content: `안녕하세요, {name}님!

아직 제출하지 않은 과제가 있습니다.
기한 내에 제출해주세요.

https://demodev-funnel.vercel.app/

demo-funnel 드림`,
  },
};
