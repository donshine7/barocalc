import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-EL89Q5P6SW";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    applicationName: "바로계산",
    title: {
      default: "바로계산 — 매일 쓰는 계산 도구",
      template: "%s | 바로계산",
    },
    description: "연봉 실수령액, 한글·영문 주소, 퍼센트, 날짜, 평수 등 일상에 필요한 계산기와 변환 도구를 빠르게 이용하세요.",
    keywords: ["계산기", "연봉 실수령액", "영문 주소 변환", "환율", "평수 계산", "날짜 계산"],
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      title: "바로계산 — 매일 쓰는 계산 도구",
      description: "필요한 계산을 검색하고 바로 사용하세요.",
      type: "website",
      locale: "ko_KR",
      url: origin,
      siteName: "바로계산",
      images: [{ url: `${origin}/og-v2.png`, width: 1731, height: 909, alt: "바로계산 — 필요한 계산을 3초 만에" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "바로계산 — 매일 쓰는 계산 도구",
      description: "필요한 계산을 검색하고 바로 사용하세요.",
      images: [`${origin}/og-v2.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
