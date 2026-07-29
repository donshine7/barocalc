import Link from "next/link";

export const metadata = {
  title: "이용약관",
  description: "바로계산 서비스의 이용 조건과 계산 결과에 관한 안내입니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main>
      <header className="site-header"><Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link><Link href="/" className="header-link">홈</Link></header>
      <article className="policy-page">
        <p className="eyebrow">Terms</p>
        <h1>이용약관</h1>
        <p>바로계산을 이용하면 아래 조건에 동의한 것으로 봅니다.</p>
        <h2>서비스의 목적</h2>
        <p>바로계산은 일상적인 계산과 단위 변환을 돕는 참고용 도구입니다. 별도의 회원가입 없이 무료로 이용할 수 있습니다.</p>
        <h2>결과의 한계</h2>
        <p>계산 결과는 입력값, 반올림 방식, 법령·요율과 외부 데이터의 변경에 따라 실제 값과 다를 수 있습니다. 세무, 법률, 금융, 고용 또는 행정상 의사결정의 유일한 근거로 사용해서는 안 됩니다.</p>
        <h2>외부 데이터</h2>
        <p>주소와 환율 등 일부 기능은 외부 기관이 제공하는 데이터를 사용합니다. 제공기관의 점검, 지연 또는 정책 변경으로 기능이 일시적으로 제한될 수 있습니다.</p>
        <h2>금지 행위</h2>
        <p>서비스를 과도하게 자동 호출하거나, 정상적인 운영을 방해하거나, 결과를 불법적인 목적으로 이용해서는 안 됩니다.</p>
        <h2>약관 변경</h2>
        <p>서비스와 관련 기준이 변경되면 이 페이지의 내용과 시행일을 수정해 안내합니다.</p>
        <p><Link href="/privacy">개인정보처리방침</Link>을 함께 확인해 주세요.</p>
        <small>시행일: 2026년 7월 29일</small>
      </article>
    </main>
  );
}
