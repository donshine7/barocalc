import Link from "next/link";

export const metadata = {
  title: "사이트 소개",
  description: "바로계산이 제공하는 생활 계산기와 운영 원칙을 안내합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <header className="site-header"><Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link><Link href="/" className="header-link">홈</Link></header>
      <article className="policy-page">
        <p className="eyebrow">About</p>
        <h1>바로계산 소개</h1>
        <p>바로계산은 급여, 날짜, 주소와 단위처럼 일상에서 반복해서 필요한 계산을 빠르고 이해하기 쉽게 제공하는 무료 웹서비스입니다.</p>
        <h2>운영 원칙</h2>
        <p>계산에 필요한 입력 항목은 최소화하고, 결과를 모바일에서도 한눈에 읽을 수 있도록 구성합니다. 계산 기준과 주의사항을 함께 표시하며 입력값은 별도로 저장하지 않습니다.</p>
        <h2>정보의 기준</h2>
        <p>주소는 행정안전부 주소정보 서비스, 환율은 공개 기준환율 데이터, 급여 계산은 적용 연도의 보험료율과 세율 기준을 참고합니다. 실제 계약·세무·행정 결과는 개인 조건과 기관 기준에 따라 달라질 수 있습니다.</p>
        <h2>문의와 개선 제안</h2>
        <p>오류 제보, 계산기 추가 제안과 서비스 관련 문의는 <a href="mailto:barocalculation@gmail.com">barocalculation@gmail.com</a>으로 보내 주세요.</p>
        <p><Link href="/terms">이용약관</Link>과 <Link href="/privacy">개인정보처리방침</Link>도 확인해 주세요.</p>
      </article>
    </main>
  );
}
