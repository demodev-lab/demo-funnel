import Header from "@/components/admin/header";
import EmailSender from "@/components/admin/email-sender";

export default function EmailPage() {
  return (
    <div className="space-y-4">
      <Header />
      <h1 className="text-2xl font-bold">이메일 발송</h1>
      <EmailSender />
    </div>
  );
}
