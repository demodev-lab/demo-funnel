import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/lib/providers/react-query-provider";
import { Toaster } from "sonner";
import MSWBootstrap from "@/lib/msw/msw-bootstrap";

export const metadata: Metadata = {
  title: "demo funnel",
  description:
    "매일 하나의 강의를 듣고 과제를 제출하는 학습 플랫폼입니다. 꾸준한 학습을 통해 실력을 키워보세요.",
  generator: "Next.js",
  icons: {
    icon: "./icon.ico",
  },
  openGraph: {
    title: "demo funnel",
    description:
      "매일 하나의 강의를 듣고 과제를 제출하는 학습 플랫폼입니다. 꾸준한 학습을 통해 실력을 키워보세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "데모 퍼널 OG 이미지",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <MSWBootstrap>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster position="top-right" richColors />
        </MSWBootstrap>
      </body>
    </html>
  );
}
