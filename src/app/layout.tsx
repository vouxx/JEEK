import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PhoneFrame } from "@/components/PhoneFrame";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "JEEK — AI/Tech Daily Digest",
  description: "매일 아침, AI와 테크 뉴스를 요약해서 전해드립니다.",
  openGraph: {
    title: "JEEK — AI/Tech Daily Digest",
    description: "매일 아침, AI와 테크 뉴스를 큐레이션합니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-neutral-900 md:bg-neutral-950 md:dark:bg-neutral-950 min-h-screen md:flex md:items-center md:justify-center md:p-4`}
      >
        <ThemeProvider>
          {/* 모바일: 풀스크린 */}
          <div className="flex flex-col min-h-screen md:hidden">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          {/* 데스크톱: 폰 목업 */}
          <div className="hidden md:block relative">
            {/* 사이드 버튼 — 왼쪽: 무음 + 볼륨 */}
            <div className="absolute -left-[8px] top-[120px] w-[3px] h-[28px] rounded-l bg-neutral-700" />
            <div className="absolute -left-[8px] top-[172px] w-[3px] h-[52px] rounded-l bg-neutral-700" />
            <div className="absolute -left-[8px] top-[232px] w-[3px] h-[52px] rounded-l bg-neutral-700" />
            {/* 사이드 버튼 — 오른쪽: 전원 */}
            <div className="absolute -right-[8px] top-[192px] w-[3px] h-[72px] rounded-r bg-neutral-700" />

            <PhoneFrame>{children}</PhoneFrame>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
