"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, tools, type Tool } from "./tools";

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s\-_/.,]/g, "");
}

function scoreTool(tool: Tool, query: string) {
  const q = normalize(query);
  if (!q) return 0;
  const name = normalize(tool.name);
  const shortName = normalize(tool.shortName);
  const category = normalize(tool.category);
  if (name === q) return 120;
  if (shortName === q) return 110;
  if (name.startsWith(q) || shortName.startsWith(q)) return 90;
  const keywordScore = tool.keywords.reduce((best, keyword) => {
    const candidate = normalize(keyword);
    if (candidate === q) return Math.max(best, 80);
    if (candidate.startsWith(q)) return Math.max(best, 65);
    if (candidate.includes(q) || q.includes(candidate)) return Math.max(best, 45);
    return best;
  }, 0);
  if (keywordScore) return keywordScore + (tool.popular ? 5 : 0);
  if (category.includes(q)) return 40;
  if (normalize(tool.description).includes(q)) return 30;
  return 0;
}

function ToolGlyph({ tool }: { tool: Tool }) {
  return <span className={`tool-glyph tone-${tool.tone}`}>{tool.glyph}</span>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      tools
        .map((tool) => ({ tool, score: scoreTool(tool, query) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || b.tool.priority - a.tool.priority)
        .slice(0, 8)
        .map((item) => item.tool),
    [query],
  );
  const popular = tools.filter((tool) => tool.popular).slice(0, 9);

  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="바로계산 홈">
          <span className="brand-mark">=</span>
          <span>바로계산</span>
        </Link>
        <a href="#all-tools" className="header-link">전체 도구</a>
      </header>

      <section className="hero">
        <div className="hero-eyebrow">매일 쓰는 계산 도구</div>
        <h1>필요한 계산을<br className="mobile-break" /> 바로 찾아보세요</h1>
        <p className="hero-copy">급여, 날짜, 주소, 단위까지. 일상에 필요한 도구를 빠르고 간단하게.</p>

        <div className="finder" role="search">
          <span className="search-icon" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="계산기나 키워드를 검색하세요"
            aria-label="계산기 검색"
            autoComplete="off"
          />
          {query && (
            <button className="clear-button" onClick={() => setQuery("")} aria-label="검색어 지우기">×</button>
          )}
        </div>
        <p className="search-examples">예: 연봉, 실수령액, 영문 주소, D-day, 평수</p>

        {!query ? (
          <div className="popular-tags" aria-label="인기 계산기">
            {popular.map((tool) => (
              <Link key={tool.id} href={tool.path} className="tag-button">{tool.shortName}</Link>
            ))}
          </div>
        ) : (
          <div className="search-panel" aria-live="polite">
            {results.length ? (
              <>
                <p className="result-count"><strong>{query}</strong> 관련 도구 {results.length}개</p>
                <div className="search-results">
                  {results.map((tool) => (
                    <Link key={tool.id} href={tool.path} className="search-result">
                      <ToolGlyph tool={tool} />
                      <span><strong>{tool.name}</strong><small>{tool.description}</small></span>
                      <span className="arrow">→</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-result">
                <strong>“{query}” 관련 도구를 찾지 못했어요</strong>
                <p>다른 단어로 검색하거나 전체 도구를 확인해 보세요.</p>
                <button onClick={() => setQuery("")}>전체 도구 보기</button>
              </div>
            )}
          </div>
        )}
      </section>

      {!query && (
        <>
          <section className="popular-section section-shell">
            <div className="section-heading">
              <span>Popular tools</span>
              <h2>많이 사용하는 도구</h2>
              <p>찾는 사람이 많은 도구를 먼저 모았어요.</p>
            </div>
            <div className="featured-grid">
              {popular.slice(0, 6).map((tool) => (
                <Link key={tool.id} href={tool.path} className="tool-card">
                  <ToolGlyph tool={tool} />
                  <div><h3>{tool.name}</h3><p>{tool.description}</p></div>
                  <span className="card-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>

          <section id="all-tools" className="all-tools section-shell">
            <div className="section-heading">
              <span>All tools</span>
              <h2>분야별로 찾아보기</h2>
              <p>원하는 분야에서 필요한 도구를 골라보세요.</p>
            </div>
            <div className="category-list">
              {categories.map((category) => (
                <div className="category-block" key={category}>
                  <div className="category-title">
                    <h3>{category}</h3>
                    <span>{tools.filter((tool) => tool.category === category).length}개 도구</span>
                  </div>
                  <div className="category-tools">
                    {tools.filter((tool) => tool.category === category).map((tool) => (
                      <Link href={tool.path} key={tool.id}>
                        <ToolGlyph tool={tool} />
                        <span><strong>{tool.name}</strong><small>{tool.description}</small></span>
                        <span className="arrow">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <footer>
        <Link href="/" className="brand footer-brand"><span className="brand-mark">=</span><span>바로계산</span></Link>
        <p>입력한 계산 값은 서버에 저장하지 않습니다.</p>
        <nav><a href="#all-tools">전체 도구</a><Link href="/about">사이트 소개</Link><Link href="/terms">이용약관</Link><Link href="/privacy">개인정보처리방침</Link></nav>
        <small>© 2026 바로계산. 계산 결과는 참고용입니다.</small>
      </footer>
    </main>
  );
}
