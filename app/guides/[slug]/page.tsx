import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "../../guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} | 바로계산`,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`,
      locale: "ko_KR",
      publishedTime: `${guide.publishedAt}T00:00:00+09:00`,
      modifiedTime: `${guide.updatedAt}T00:00:00+09:00`,
      images: [{ url: "/og-v2.png", width: 1731, height: 909, alt: `${guide.title} — 바로계산` }],
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const siteUrl = "https://barocalc.co.kr";
  const articleUrl = `${siteUrl}/guides/${guide.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: articleUrl,
    author: { "@type": "Organization", name: "바로계산", url: siteUrl },
    publisher: { "@type": "Organization", name: "바로계산", url: siteUrl },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="site-header">
        <Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link>
        <Link href="/guides" className="header-link">전체 가이드</Link>
      </header>
      <article className="article-page">
        <nav className="breadcrumb"><Link href="/">홈</Link><span>/</span><Link href="/guides">가이드</Link><span>/</span><span>{guide.category}</span></nav>
        <header className="article-header">
          <p className="eyebrow">{guide.category} guide</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
          <span>업데이트 {guide.updatedAt} · {guide.readTime}</span>
        </header>
        <div className="article-body">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
            </section>
          ))}
        </div>
        <aside className="article-cta">
          <span>바로 확인해 보세요</span>
          <strong>{guide.toolLabel}</strong>
          <Link href={guide.toolPath}>계산기 열기 →</Link>
        </aside>
        <p className="article-disclaimer">이 글은 일반적인 이해를 돕기 위한 정보이며 실제 급여·계약·결제 결과는 개인 조건과 기관 기준에 따라 달라질 수 있습니다.</p>
      </article>
    </main>
  );
}
