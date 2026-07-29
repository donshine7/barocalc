export type Tone = "blue" | "mint" | "violet" | "orange" | "rose";

export type Tool = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  path: string;
  keywords: string[];
  popular?: boolean;
  priority: number;
  glyph: string;
  tone: Tone;
};

export const categories = ["급여·소득", "생활 계산", "날짜·시간", "단위·문서"] as const;

export const tools: Tool[] = [
  {
    id: "salary", name: "연봉 실수령액 계산기", shortName: "연봉 계산기", category: "급여·소득",
    description: "2026년 기준 예상 월급과 공제액 계산", path: "/salary/net-pay",
    keywords: ["연봉", "월급", "급여", "실수령액", "세후", "세전", "4대보험", "소득세", "salary", "pay"],
    popular: true, priority: 100, glyph: "₩", tone: "blue",
  },
  {
    id: "monthly", name: "월급 실수령액 계산기", shortName: "월급 계산기", category: "급여·소득",
    description: "세전 월급으로 예상 실수령액 계산", path: "/salary/monthly-pay",
    keywords: ["월급", "급여", "실수령", "세후월급", "공제"], priority: 86, glyph: "월", tone: "blue",
  },
  {
    id: "raise", name: "연봉 인상률 계산기", shortName: "연봉 인상률", category: "급여·소득",
    description: "이전 연봉과 새 연봉의 인상률 계산", path: "/salary/raise-rate",
    keywords: ["연봉인상", "인상률", "연봉협상", "상승률", "변화율"], priority: 80, glyph: "↗", tone: "mint",
  },
  {
    id: "hourly", name: "시급·월급 변환기", shortName: "시급 변환", category: "급여·소득",
    description: "시급을 월급과 연봉으로 간편 환산", path: "/salary/hourly",
    keywords: ["시급", "월급", "주급", "일급", "최저시급", "알바"], priority: 72, glyph: "시", tone: "violet",
  },
  {
    id: "address", name: "한글·영문 주소 변환기", shortName: "한영 주소 변환", category: "생활 계산",
    description: "도로명주소, 영문주소와 우편번호 확인", path: "/life/address",
    keywords: ["주소", "주소변환", "한글주소", "영문주소", "영어주소", "한영주소", "도로명주소", "지번주소", "우편번호", "해외배송", "국제우편", "address", "postal code", "zip code"],
    popular: true, priority: 98, glyph: "A", tone: "mint",
  },
  {
    id: "percentage", name: "퍼센트 계산기", shortName: "퍼센트", category: "생활 계산",
    description: "비율, 증감률과 백분율을 빠르게 계산", path: "/life/percentage",
    keywords: ["퍼센트", "백분율", "비율", "몇프로", "증감률", "%"], popular: true, priority: 94, glyph: "%", tone: "violet",
  },
  {
    id: "discount", name: "할인율 계산기", shortName: "할인율", category: "생활 계산",
    description: "할인 금액과 최종 결제금액 계산", path: "/life/discount",
    keywords: ["할인", "세일", "할인가", "할인율", "정가"], popular: true, priority: 88, glyph: "↓", tone: "rose",
  },
  {
    id: "vat", name: "부가세 계산기", shortName: "부가세", category: "생활 계산",
    description: "공급가액과 부가가치세 간편 계산", path: "/life/vat",
    keywords: ["부가세", "부가가치세", "공급가액", "세금", "vat"], priority: 82, glyph: "V", tone: "orange",
  },
  {
    id: "dutch", name: "더치페이 계산기", shortName: "더치페이", category: "생활 계산",
    description: "인원수에 맞춰 결제금액 나누기", path: "/life/dutch-pay",
    keywords: ["더치페이", "n빵", "나누기", "회비", "정산"], popular: true, priority: 74, glyph: "÷", tone: "orange",
  },
  {
    id: "date", name: "날짜 차이 계산기", shortName: "날짜 계산", category: "날짜·시간",
    description: "두 날짜 사이의 기간과 일수 계산", path: "/date/difference",
    keywords: ["날짜", "일수", "기간", "며칠", "날짜차이", "day"], popular: true, priority: 92, glyph: "D", tone: "blue",
  },
  {
    id: "dday", name: "D-day 계산기", shortName: "D-day", category: "날짜·시간",
    description: "목표일까지 남은 날짜를 한눈에 확인", path: "/date/d-day",
    keywords: ["디데이", "d-day", "남은날짜", "기념일", "시험일"], priority: 84, glyph: "D", tone: "rose",
  },
  {
    id: "age", name: "만 나이 계산기", shortName: "만 나이", category: "날짜·시간",
    description: "생년월일을 기준으로 현재 만 나이 계산", path: "/date/age",
    keywords: ["만나이", "나이", "생년월일", "연령", "age"], popular: true, priority: 80, glyph: "만", tone: "mint",
  },
  {
    id: "area", name: "평수·제곱미터 변환기", shortName: "평수 변환", category: "단위·문서",
    description: "평과 ㎡를 서로 간편하게 변환", path: "/unit/area",
    keywords: ["평수", "제곱미터", "평", "m2", "㎡", "아파트면적"], popular: true, priority: 90, glyph: "㎡", tone: "blue",
  },
  {
    id: "characters", name: "글자 수 계산기", shortName: "글자 수", category: "단위·문서",
    description: "공백 포함·제외 글자와 바이트 수 확인", path: "/text/character-count",
    keywords: ["글자수", "문자수", "바이트", "공백제외", "자소서", "원고"], popular: true, priority: 86, glyph: "가", tone: "violet",
  },
];

export function getToolByPath(category: string, slug: string) {
  return tools.find((tool) => tool.path === `/${category}/${slug}`);
}
