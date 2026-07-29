import Link from "next/link";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <main>
      <header className="site-header"><Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link><Link href="/" className="header-link">홈</Link></header>
      <article className="policy-page">
        <p className="eyebrow">Privacy</p>
        <h1>개인정보처리방침</h1>
        <p>바로계산은 계산기에 입력한 값을 저장하지 않습니다. 일반 계산은 사용자의 브라우저 안에서 처리됩니다.</p>
        <h2>주소 검색</h2>
        <p>주소 검색어는 공식 도로명주소 검색 서비스에 결과 조회를 위해 전달되며, 바로계산은 검색어를 별도로 보관하지 않습니다.</p>
        <h2>접속 정보와 광고</h2>
        <p>서비스 품질 분석 및 광고 제공 과정에서 쿠키, 접속기기와 페이지 이용 정보가 처리될 수 있습니다. 광고 도입 전에 이용 중인 광고·분석 서비스와 거부 방법을 이 문서에 구체적으로 추가합니다.</p>
        <h2>문의</h2>
        <p>개인정보 관련 문의를 위한 운영자 연락처는 정식 도메인 확정 시 게시합니다.</p>
        <small>시행일: 2026년 7월 28일</small>
      </article>
    </main>
  );
}
