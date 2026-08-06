export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  toolId: string;
  toolPath: string;
  toolLabel: string;
  readTime: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "salary-5000-net-pay",
    title: "2026년 연봉 5천만 원 실수령액과 공제항목 정리",
    description: "연봉 5천만 원의 예상 월 실수령액과 4대보험·소득세 공제 구조를 이해하기 쉽게 정리합니다.",
    category: "급여",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    toolId: "salary",
    toolPath: "/salary/net-pay",
    toolLabel: "연봉 실수령액 계산하기",
    readTime: "약 4분",
    sections: [
      {
        heading: "연봉 5천만 원이면 매달 얼마를 받을까",
        paragraphs: [
          "연봉 5천만 원을 12개월로 단순히 나누면 세전 월급은 약 416만 원입니다. 여기에서 국민연금, 건강보험, 장기요양보험, 고용보험과 소득세·지방소득세가 빠진 금액이 실제 입금되는 월급입니다.",
          "비과세 식대가 월 20만 원이고 부양가족이 본인 1명인 일반적인 조건에서는 월 실수령액이 대략 350만 원대가 될 수 있습니다. 다만 상여금 지급 방식과 회사의 비과세 항목에 따라 월별 금액은 달라집니다.",
        ],
      },
      {
        heading: "급여에서 공제되는 항목",
        paragraphs: ["급여명세서의 공제액은 크게 사회보험료와 세금으로 나뉩니다."],
        bullets: [
          "국민연금: 기준소득월액과 상·하한액을 적용해 계산",
          "건강보험·장기요양보험: 보수월액과 해당 연도 보험료율을 적용",
          "고용보험: 과세 급여와 근로자 부담률을 기준으로 계산",
          "소득세·지방소득세: 과세표준, 부양가족과 세액공제에 따라 달라짐",
        ],
      },
      {
        heading: "계산 결과가 급여명세서와 다른 이유",
        paragraphs: [
          "온라인 계산기는 공통 기준을 적용한 예상치입니다. 회사가 지급하는 식대·자가운전보조금 등 비과세 항목, 부양가족과 자녀 수, 상여금 지급 시점, 연말정산 결과는 개인마다 다릅니다.",
          "연봉 협상 때는 예상 실수령액으로 월 예산을 세우되, 최종 금액은 회사가 발급한 급여명세서에서 확인하는 것이 가장 정확합니다.",
        ],
      },
    ],
  },
  {
    slug: "english-address-fields",
    title: "해외 배송 영문 주소 입력란별 작성법",
    description: "Address line 1·2, City, State, Postal code와 Country에 한국 주소를 나누어 입력하는 방법을 설명합니다.",
    category: "주소",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    toolId: "address",
    toolPath: "/life/address",
    toolLabel: "한글 주소를 영문 주소로 변환하기",
    readTime: "약 4분",
    sections: [
      {
        heading: "한국 주소를 해외 사이트에 입력하는 기본 순서",
        paragraphs: [
          "해외 쇼핑몰의 주소 입력 화면은 보통 Address line 1, Address line 2, City, State/Province, Postal code, Country로 나뉩니다. 한국 주소는 도로명과 건물번호를 Address line 1에, 아파트·동·호수 같은 상세주소를 Address line 2에 적는 방식이 가장 일반적입니다.",
          "영문 주소의 단어 순서보다 우편번호와 도로명, 건물번호가 정확한지가 더 중요합니다. 수취인 이름과 전화번호도 배송사가 연락할 수 있도록 정확히 입력하세요.",
        ],
      },
      {
        heading: "입력란별로 무엇을 적을까",
        paragraphs: ["예를 들어 서울특별시 중구 세종대로 110이라면 다음 원칙으로 나눌 수 있습니다."],
        bullets: [
          "Address line 1: 도로명과 건물번호",
          "Address line 2: 아파트명, 동·층·호수 등 상세주소",
          "City: 시·군·구에 해당하는 지역명",
          "State/Province: 특별시·광역시·도",
          "Postal code: 5자리 우편번호",
          "Country: South Korea 또는 Republic of Korea",
        ],
      },
      {
        heading: "검색 결과가 여러 개 나올 때",
        paragraphs: [
          "같은 도로명과 건물번호에 여러 주소가 보이면 한글 도로명주소, 건물명과 우편번호를 함께 비교하세요. 주소 검색 결과의 영문 표기는 공식 주소 데이터에 기반하지만 상세주소는 직접 추가해야 합니다.",
          "국제우편이나 중요한 서류라면 변환 결과를 복사한 뒤 수취 기관이 요구하는 표기 형식과 한 번 더 대조하는 것이 안전합니다.",
        ],
      },
    ],
  },
  {
    slug: "84-square-meter-to-pyeong",
    title: "84㎡는 몇 평일까? 전용면적과 공급면적 차이",
    description: "84제곱미터의 평수 환산값과 아파트 전용면적·공급면적을 구분하는 방법을 정리합니다.",
    category: "면적",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    toolId: "area",
    toolPath: "/unit/area",
    toolLabel: "㎡와 평을 바로 변환하기",
    readTime: "약 3분",
    sections: [
      {
        heading: "84㎡를 평으로 단순 환산하면",
        paragraphs: [
          "1평은 약 3.305785㎡이므로 84㎡를 나누면 약 25.4평입니다. 이 값은 전용면적 84㎡ 자체를 평 단위로 바꾼 결과입니다.",
          "부동산 광고에서 전용 84㎡ 아파트를 흔히 33평형이나 34평형이라고 부르는 이유는 복도·계단 등 공용면적을 더한 공급면적을 기준으로 표현하기 때문입니다.",
        ],
      },
      {
        heading: "전용면적·공급면적·계약면적",
        paragraphs: ["평수 변환 전에 계약서에 적힌 면적의 종류를 먼저 확인해야 합니다."],
        bullets: [
          "전용면적: 거실, 방, 주방 등 세대가 독립적으로 사용하는 면적",
          "주거공용면적: 복도, 계단, 공동현관 등 입주민이 함께 사용하는 면적",
          "공급면적: 전용면적과 주거공용면적을 합한 면적",
          "계약면적: 공급면적에 주차장 등 기타 공용면적까지 더한 면적",
        ],
      },
      {
        heading: "평수 비교 시 주의할 점",
        paragraphs: [
          "같은 전용 84㎡라도 단지 설계와 공용면적 비율에 따라 공급면적과 체감 공간은 달라질 수 있습니다. 발코니 확장 면적도 전용면적에 그대로 포함되는 것은 아닙니다.",
          "매매나 임대차를 비교할 때는 평형 이름만 보지 말고 전용면적과 공급면적을 각각 확인하세요.",
        ],
      },
    ],
  },
  {
    slug: "exchange-rate-card-fees",
    title: "해외 카드결제 전 환율 계산과 수수료 확인법",
    description: "기준환율과 실제 카드 청구액이 다른 이유, 해외서비스 수수료와 결제일 환율을 확인하는 방법을 설명합니다.",
    category: "환율",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-06",
    toolId: "currency",
    toolPath: "/unit/currency",
    toolLabel: "최신 기준환율로 환산하기",
    readTime: "약 4분",
    sections: [
      {
        heading: "기준환율과 카드 청구액은 왜 다를까",
        paragraphs: [
          "환율 계산기에 표시되는 값은 통화 간 가치를 비교하기 위한 기준환율입니다. 실제 해외 카드결제에는 국제 브랜드 수수료, 카드사의 해외서비스 수수료와 결제 처리 시점의 환율이 추가로 반영될 수 있습니다.",
          "따라서 계산기의 원화 환산액은 구매 전 예산을 잡기 위한 기준으로 사용하고, 최종 금액은 카드 승인·매입 내역에서 확인해야 합니다.",
        ],
      },
      {
        heading: "결제 전에 확인할 네 가지",
        paragraphs: ["같은 상품도 결제 통화와 카드 조건에 따라 원화 청구액이 달라질 수 있습니다."],
        bullets: [
          "상품 가격에 현지 세금과 배송비가 포함됐는지",
          "카드 국제 브랜드와 카드사 해외이용 수수료",
          "승인일이 아니라 매입일 환율이 적용될 수 있는지",
          "원화결제(DCC)가 자동 선택되지 않았는지",
        ],
      },
      {
        heading: "환율 계산기를 활용하는 방법",
        paragraphs: [
          "외화 금액을 원화로 먼저 환산한 뒤 예상 수수료를 여유분으로 더하면 실제 지출 범위를 가늠하기 쉽습니다. 여러 통화 중 결제 통화를 선택할 수 있다면 카드사가 안내하는 환율과 수수료 조건을 비교하세요.",
          "환율은 계속 변하므로 화면에 표시되는 기준 날짜를 함께 확인하고, 큰 금액을 결제할 때는 카드사와 은행의 최신 안내를 우선하세요.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
