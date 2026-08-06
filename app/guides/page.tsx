import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "../guides";

export const metadata: Metadata = {
  title: "생활 계산 가이드",
  description: "연봉 실수령액, 영문 주소, 평수와 환율 계산을 실제 상황에 맞게 설명하는 바로계산 가이드입니다.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link>
        <Link href="/" className="header-link">도구 검색</Link>
      </header>
      <div className="guide-index section-shell">
        <p className="eyebrow">Practical guides</p>
        <h1>계산 전에 알아두면 좋은 내용</h1>
        <p className="guide-index-lead">숫자만 변환하는 데서 끝나지 않도록 실제 입력 방법과 결과를 해석하는 기준을 정리했습니다.</p>
        <div className="guide-grid">
          {guides.map((guide) => (
            <article key={guide.slug} className="guide-card">
              <span>{guide.category} · {guide.readTime}</span>
              <h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2>
              <p>{guide.description}</p>
              <Link href={`/guides/${guide.slug}`} className="guide-card-link">가이드 읽기 →</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
