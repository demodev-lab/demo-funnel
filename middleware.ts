import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // /class 경로로 접근하면 /login으로 리다이렉트
  if (request.nextUrl.pathname === "/class") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 기존 Supabase 세션 업데이트 로직 실행
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
