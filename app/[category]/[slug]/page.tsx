import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolByPath, tools } from "../../tools";
import ToolPageClient from "./tool-page-client";

export function generateStaticParams() {
  return tools.map((tool) => {
    const [, category, slug] = tool.path.split("/");
    return { category, slug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getToolByPath(category, slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: `${tool.description}. 가입 없이 모바일과 PC에서 바로 계산하세요.`,
    keywords: tool.keywords,
    alternates: { canonical: tool.path },
    openGraph: {
      title: `${tool.name} | 바로계산`,
      description: `${tool.description}. 무료로 바로 사용하세요.`,
      type: "website",
      url: tool.path,
      locale: "ko_KR",
      images: [{ url: "/og-v2.png", width: 1731, height: 909, alt: `${tool.name} — 바로계산` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | 바로계산`,
      description: `${tool.description}. 무료로 바로 사용하세요.`,
      images: ["/og-v2.png"],
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = getToolByPath(category, slug);
  if (!tool) notFound();
  const siteUrl = "https://barocalc.co.kr";
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      description: tool.description,
      url: `${siteUrl}${tool.path}`,
      applicationCategory: tool.category === "급여·소득" ? "FinanceApplication" : "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      inLanguage: "ko-KR",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      publisher: { "@type": "Organization", name: "바로계산", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
        { "@type": "ListItem", position: 2, name: tool.category },
        { "@type": "ListItem", position: 3, name: tool.name, item: `${siteUrl}${tool.path}` },
      ],
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <ToolPageClient tool={tool} />
    </>
  );
}
