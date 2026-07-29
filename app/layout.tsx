import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: {
      default: "바로계산 — 매일 쓰는 계산 도구",
      template: "%s | 바로계산",
    },
    description: "연봉 실수령액, 한글·영문 주소, 퍼센트, 날짜, 평수 등 일상에 필요한 계산기와 변환 도구를 빠르게 이용하세요.",
    openGraph: {
      title: "바로계산 — 매일 쓰는 계산 도구",
      description: "필요한 계산을 검색하고 바로 사용하세요.",
      type: "website",
      locale: "ko_KR",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "바로계산 — 필요한 계산을 바로 찾아보세요" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "바로계산 — 매일 쓰는 계산 도구",
      description: "필요한 계산을 검색하고 바로 사용하세요.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
