export type EmailTemplateType = "lecture-open" | "assignment-reminder";

export interface EmailTemplate {
  id: EmailTemplateType;
  subject: string;
  content: string;
}

export interface EmailSendRequest {
  to: string[];
  template: EmailTemplateType;
  variables: {
    name?: string;
    lectureName?: string;
    openDate?: string;
    assignmentName?: string;
    dueDate?: string;
    customContent?: string;
  };
}

export interface EmailSendResponse {
  success: boolean;
  message?: string;
  failedEmails?: string[];
}
