import { redirect } from "next/navigation";

export default function Home() {
  // TODO: 랜딩페이지로 수정
  redirect("/login");
}
