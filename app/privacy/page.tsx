import Link from "next/link";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <main>
      <header className="site-header"><Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link><Link href="/" className="header-link">홈</Link></header>
      <article className="policy-page">
        <p className="eyebrow">Privacy</p>
        <h1>개인정보처리방침</h1>
        <p>바로계산은 계산기에 입력한 값을 별도로 저장하지 않습니다. 일반 계산은 사용자의 브라우저 안에서 처리됩니다.</p>
        <h2>주소 검색</h2>
        <p>주소 검색어는 결과 조회를 위해 행정안전부 주소정보 검색 서비스에 전달됩니다. 바로계산은 검색어를 회원 정보와 결합하거나 별도 데이터베이스에 보관하지 않습니다.</p>
        <h2>접속 정보</h2>
        <p>서비스 운영, 오류 확인과 보안을 위해 호스팅 과정에서 접속 시각, 요청 페이지, 브라우저·기기 정보와 IP 주소가 자동으로 처리될 수 있습니다.</p>
        <h2>광고와 쿠키</h2>
        <p>광고가 도입되면 Google을 포함한 제3자 광고 사업자가 이전 방문 기록을 바탕으로 광고를 제공하기 위해 쿠키, 웹 비콘, IP 주소와 유사 식별자를 사용할 수 있습니다.</p>
        <p>Google과 파트너의 광고 쿠키 사용을 원하지 않는 사용자는 <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google 광고 설정</a>에서 맞춤형 광고를 관리하거나 사용 중지할 수 있습니다.</p>
        <h2>문의</h2>
        <p>서비스 및 개인정보 관련 문의는 <a href="mailto:barocalculation@gmail.com">barocalculation@gmail.com</a>으로 보내 주세요. 운영 정보는 <Link href="/about">사이트 소개</Link> 페이지에서도 확인할 수 있습니다.</p>
        <small>시행일: 2026년 7월 29일</small>
      </article>
    </main>
  );
}
