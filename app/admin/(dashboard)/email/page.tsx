import Header from "@/components/admin/header";
import EmailSender from "@/components/admin/email-sender";

export default function EmailPage() {
  return (
    <div className="space-y-6 p-6">
      <Header />
      <h1 className="text-2xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
          이메일 발송
        </span>
      </h1>
      <EmailSender />
    </div>
  );
}
