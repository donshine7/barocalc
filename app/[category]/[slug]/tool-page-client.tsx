"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "../../google-analytics";
import { guides as practicalGuides } from "../../guides";
import SharePanel from "../../share-panel";
import { toolFaqs } from "../../tool-faqs";
import { tools, type Tool } from "../../tools";
import { toolGuides } from "../../tool-guides";

const won = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 });

function parseNumber(value: string) {
  return Number(value.replaceAll(",", "")) || 0;
}

function currency(value: number) {
  return `${won.format(Math.max(0, Math.round(value / 10) * 10))}원`;
}

function Field({
  label, value, onChange, suffix, type = "text", placeholder, min,
}: {
  label: string; value: string; onChange: (value: string) => void; suffix?: string;
  type?: string; placeholder?: string; min?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="field-control">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={type === "date" ? undefined : "decimal"}
          min={min}
        />
        {suffix && <em>{suffix}</em>}
      </div>
    </label>
  );
}

function ResultCard({
  label, value, sub, rows,
}: {
  label: string; value: string; sub?: string; rows?: Array<[string, string]>;
}) {
  return (
    <section className="result-card" aria-live="polite">
      <span className="result-label">{label}</span>
      <strong className="result-value">{value}</strong>
      {sub && <p>{sub}</p>}
      {rows && (
        <dl>
          {rows.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}
        </dl>
      )}
    </section>
  );
}

function CalculatorShell({ children, note }: { children: ReactNode; note?: string }) {
  const hasTrackedUse = useRef(false);
  function trackFirstUse() {
    if (hasTrackedUse.current) return;
    hasTrackedUse.current = true;
    trackAnalyticsEvent("calculator_use", { tool_path: window.location.pathname });
  }
  return (
    <div className="calculator-panel" onInputCapture={trackFirstUse} onChangeCapture={trackFirstUse}>
      {children}
      {note && <p className="form-note">{note}</p>}
    </div>
  );
}

function earnedIncomeDeduction(gross: number) {
  if (gross <= 5_000_000) return gross * 0.7;
  if (gross <= 15_000_000) return 3_500_000 + (gross - 5_000_000) * 0.4;
  if (gross <= 45_000_000) return 7_500_000 + (gross - 15_000_000) * 0.15;
  if (gross <= 100_000_000) return 12_000_000 + (gross - 45_000_000) * 0.05;
  return Math.min(20_000_000, 14_750_000 + (gross - 100_000_000) * 0.02);
}

function calculateProgressiveTax(taxBase: number) {
  const brackets = [
    { max: 14_000_000, rate: 0.06, deduction: 0 },
    { max: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { max: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { max: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { max: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { max: 500_000_000, rate: 0.4, deduction: 25_940_000 },
    { max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { max: Infinity, rate: 0.45, deduction: 65_940_000 },
  ];
  const bracket = brackets.find((item) => taxBase <= item.max) || brackets[brackets.length - 1];
  return { annualTax: Math.max(0, taxBase * bracket.rate - bracket.deduction), marginalRate: bracket.rate };
}

function estimateSalary(annualSalary: number, monthlyNonTax: number, familyCount: number) {
  const monthlyGross = annualSalary / 12;
  const insured = Math.max(0, monthlyGross - monthlyNonTax);
  const pension = Math.min(insured, 6_370_000) * 0.0475;
  const health = insured * 0.03595;
  const longCare = health * 0.1314;
  const employment = insured * 0.009;
  const annualGross = Math.max(0, annualSalary - monthlyNonTax * 12);
  const familyDeduction = Math.max(1, familyCount) * 1_500_000;
  const socialInsuranceDeduction = (pension + health + longCare + employment) * 12;
  const annualTaxBase = Math.max(
    0,
    annualGross - earnedIncomeDeduction(annualGross) - familyDeduction - socialInsuranceDeduction,
  );
  const progressiveTax = calculateProgressiveTax(annualTaxBase);
  const earnedIncomeTaxCredit = Math.min(
    660_000,
    progressiveTax.annualTax <= 1_300_000
      ? progressiveTax.annualTax * 0.55
      : 715_000 + (progressiveTax.annualTax - 1_300_000) * 0.3,
  );
  const incomeTax = Math.max(0, progressiveTax.annualTax - earnedIncomeTaxCredit) / 12;
  const localTax = incomeTax * 0.1;
  const deductions = pension + health + longCare + employment + incomeTax + localTax;
  return {
    monthlyGross, pension, health, longCare, employment, incomeTax, localTax, deductions,
    net: monthlyGross - deductions, annualTaxBase, familyDeduction,
    marginalRate: progressiveTax.marginalRate,
  };
}

function SalaryCalculator({ monthly = false }: { monthly?: boolean }) {
  const [amount, setAmount] = useState(monthly ? "3500000" : "50000000");
  const [nonTax, setNonTax] = useState("200000");
  const [familyCount, setFamilyCount] = useState("1");
  const annual = monthly ? parseNumber(amount) * 12 : parseNumber(amount);
  const result = useMemo(
    () => estimateSalary(annual, parseNumber(nonTax), Math.max(1, parseNumber(familyCount))),
    [annual, nonTax, familyCount],
  );
  return (
    <CalculatorShell note="2026년 근로자 부담 보험료율과 기본 인적공제(본인·배우자·공제대상 부양가족 1명당 연 150만원)를 반영한 예상치입니다. 간이세액표와 개인별 세액공제에 따라 실제 급여명세와 다를 수 있습니다.">
      <div className="form-grid">
        <Field label={monthly ? "세전 월급" : "연봉"} value={amount} onChange={setAmount} suffix="원" />
        <Field label="월 비과세액" value={nonTax} onChange={setNonTax} suffix="원" />
        <Field label="부양가족 수 (본인 포함)" type="number" min="1" value={familyCount} onChange={setFamilyCount} suffix="명" />
      </div>
      <ResultCard
        label="예상 월 실수령액"
        value={currency(result.net)}
        sub={`세전 월급 ${currency(result.monthlyGross)} 기준`}
        rows={[
          ["국민연금", currency(result.pension)],
          ["건강보험", currency(result.health)],
          ["장기요양", currency(result.longCare)],
          ["고용보험", currency(result.employment)],
          ["예상 소득세", currency(result.incomeTax)],
          ["지방소득세", currency(result.localTax)],
          ["월 예상 공제액", currency(result.deductions)],
          ["인적공제 반영액", currency(result.familyDeduction)],
          ["예상 과세표준", currency(result.annualTaxBase)],
          ["적용 소득세율", `${result.marginalRate * 100}%`],
        ]}
      />
    </CalculatorShell>
  );
}

function RaiseCalculator() {
  const [before, setBefore] = useState("40000000");
  const [after, setAfter] = useState("45000000");
  const prev = parseNumber(before);
  const next = parseNumber(after);
  const rate = prev ? ((next - prev) / prev) * 100 : 0;
  return (
    <CalculatorShell>
      <div className="form-grid"><Field label="이전 연봉" value={before} onChange={setBefore} suffix="원" /><Field label="새 연봉" value={after} onChange={setAfter} suffix="원" /></div>
      <ResultCard label="연봉 인상률" value={`${number.format(rate)}%`} rows={[["연봉 차이", currency(next - prev)], ["월 환산 차이", currency((next - prev) / 12)]]} />
    </CalculatorShell>
  );
}

function HourlyCalculator() {
  const [hourly, setHourly] = useState("10320");
  const [hours, setHours] = useState("40");
  const weekly = parseNumber(hourly) * parseNumber(hours);
  const monthly = weekly * 4.345;
  return (
    <CalculatorShell note="주휴수당과 각종 수당은 포함하지 않은 단순 환산입니다.">
      <div className="form-grid"><Field label="시급" value={hourly} onChange={setHourly} suffix="원" /><Field label="주당 근무시간" value={hours} onChange={setHours} suffix="시간" /></div>
      <ResultCard label="예상 월급" value={currency(monthly)} rows={[["주급", currency(weekly)], ["연봉 환산", currency(monthly * 12)]]} />
    </CalculatorShell>
  );
}

type AddressItem = { roadAddr?: string; jibunAddr?: string; engAddr?: string; zipNo?: string };

function splitInternationalAddress(item: AddressItem, addressLine2: string) {
  const parts = (item.engAddr || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const addressLine1 = parts[0] || "";
  const region = parts.length > 1 ? parts[parts.length - 1] : "";
  const city = parts.length > 2 ? parts.slice(1, -1).join(", ") : parts[1] || "";
  const fields = [
    { label: "Address line 1", value: addressLine1, hint: "도로명·건물번호" },
    { label: "Address line 2", value: addressLine2.trim(), hint: "아파트·동·층·호 (선택)" },
    { label: "City / Locality", value: city, hint: "도시·시군구" },
    { label: "State / Province / Region", value: region, hint: "시·도" },
    { label: "ZIP / Postal code", value: item.zipNo || "", hint: "우편번호" },
    { label: "Country / Region", value: "South Korea", hint: "국가" },
  ];
  const mailingLabel = [
    addressLine1,
    addressLine2.trim(),
    [city, region, item.zipNo].filter(Boolean).join(", "),
    "South Korea",
  ].filter(Boolean).join("\n");
  return { fields, mailingLabel };
}

function AddressCalculator() {
  const [mode, setMode] = useState<"ko" | "en">("ko");
  const [query, setQuery] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [items, setItems] = useState<AddressItem[]>([]);
  const [status, setStatus] = useState("");
  async function search(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length < 2) return setStatus("주소를 두 글자 이상 입력해 주세요.");
    setStatus("공식 주소를 찾고 있어요…");
    setItems([]);
    try {
      const response = await fetch(`/api/address?q=${encodeURIComponent(query)}&mode=${mode}`);
      const body = await response.json() as { items?: AddressItem[]; message?: string };
      if (!response.ok) throw new Error(body.message || "주소 검색을 사용할 수 없습니다.");
      const results = body.items || [];
      setItems(results);
      setStatus(results.length ? "" : "일치하는 주소가 없습니다. 도로명과 건물번호를 함께 입력해 보세요.");
      trackAnalyticsEvent("address_search", {
        search_language: mode,
        search_outcome: results.length ? "results" : "no_results",
        result_count: results.length,
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "주소 검색 중 문제가 발생했습니다.");
    }
  }
  async function copy(value: string | undefined, resultType: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    trackAnalyticsEvent("result_copy", { tool_path: "/life/address", result_type: resultType });
  }
  return (
    <CalculatorShell note="행정안전부 도로명주소 API를 사용합니다. 해외 사이트의 국가 선택 목록에서는 South Korea 또는 Korea, Republic of를 선택하세요.">
      <div className="segmented">
        <button className={mode === "ko" ? "active" : ""} onClick={() => setMode("ko")}>한글 주소로 찾기</button>
        <button className={mode === "en" ? "active" : ""} onClick={() => setMode("en")}>영문 주소로 찾기</button>
      </div>
      <form className="address-search" onSubmit={search}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === "ko" ? "예: 세종대로 110" : "예: 110 Sejong-daero"} />
        <button type="submit">주소 검색</button>
      </form>
      <label className="address-detail-field">
        <span>영문 상세주소 <small>선택</small></span>
        <input
          value={addressLine2}
          onChange={(event) => setAddressLine2(event.target.value)}
          placeholder="예: Apt 101-1001"
          autoComplete="address-line2"
        />
        <em>아파트·동·층·호는 검색 결과에 포함되지 않으므로 영문으로 직접 입력해 주세요.</em>
      </label>
      {status && <p className="status-message">{status}</p>}
      <div className="address-results">
        {items.map((item, index) => {
          const international = splitInternationalAddress(item, addressLine2);
          return (
            <article key={`${item.roadAddr}-${index}`}>
              <span className="zip">우편번호 {item.zipNo}</span>
              <h3>{item.roadAddr || item.jibunAddr}</h3>
              <p>{item.engAddr}</p>
              <div className="address-actions">
                <button type="button" onClick={() => copy(item.roadAddr, "korean_address")}>한글 주소 복사</button>
                <button type="button" onClick={() => copy(international.mailingLabel, "full_english_address")}>전체 영문 주소 복사</button>
              </div>
              <section className="international-address" aria-label="미국식 영문 주소 입력 항목">
                <div className="international-address-heading">
                  <div>
                    <strong>미국식 영문 주소 입력 항목</strong>
                    <span>해외 웹사이트의 같은 이름 입력란에 복사하세요.</span>
                  </div>
                  <button type="button" onClick={() => copy(international.mailingLabel, "full_english_address")}>전체 복사</button>
                </div>
                <dl>
                  {international.fields.map((field) => (
                    <div key={field.label}>
                      <dt><span>{field.label}</span><small>{field.hint}</small></dt>
                      <dd className={field.value ? "" : "empty"}>
                        <span>{field.value || "직접 입력"}</span>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => copy(field.value, `field_${field.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}`)}
                            aria-label={`${field.label} 복사`}
                          >
                            복사
                          </button>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </article>
          );
        })}
      </div>
    </CalculatorShell>
  );
}

function PercentageCalculator() {
  const [base, setBase] = useState("50000");
  const [rate, setRate] = useState("20");
  const value = parseNumber(base) * parseNumber(rate) / 100;
  return <CalculatorShell><div className="form-grid"><Field label="기준값" value={base} onChange={setBase} /><Field label="퍼센트" value={rate} onChange={setRate} suffix="%" /></div><ResultCard label={`${won.format(parseNumber(base))}의 ${rate}%`} value={number.format(value)} rows={[["나머지 값", number.format(parseNumber(base) - value)]]} /></CalculatorShell>;
}

function DiscountCalculator() {
  const [price, setPrice] = useState("100000");
  const [rate, setRate] = useState("20");
  const discount = parseNumber(price) * parseNumber(rate) / 100;
  return <CalculatorShell><div className="form-grid"><Field label="정가" value={price} onChange={setPrice} suffix="원" /><Field label="할인율" value={rate} onChange={setRate} suffix="%" /></div><ResultCard label="최종 결제금액" value={currency(parseNumber(price) - discount)} rows={[["할인 금액", currency(discount)]]} /></CalculatorShell>;
}

function VatCalculator() {
  const [amount, setAmount] = useState("110000");
  const total = parseNumber(amount);
  const supply = total / 1.1;
  return <CalculatorShell><Field label="부가세 포함 금액" value={amount} onChange={setAmount} suffix="원" /><ResultCard label="공급가액" value={currency(supply)} rows={[["부가세", currency(total - supply)], ["합계", currency(total)]]} /></CalculatorShell>;
}

function DutchCalculator() {
  const [amount, setAmount] = useState("120000");
  const [people, setPeople] = useState("4");
  const count = Math.max(1, parseNumber(people));
  return <CalculatorShell><div className="form-grid"><Field label="총 결제금액" value={amount} onChange={setAmount} suffix="원" /><Field label="인원" value={people} onChange={setPeople} suffix="명" /></div><ResultCard label="1인당 금액" value={currency(parseNumber(amount) / count)} /></CalculatorShell>;
}

function isoDateOffset(days: number) {
  return new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);
}

function DateDifferenceCalculator() {
  const [start, setStart] = useState(() => isoDateOffset(0));
  const [end, setEnd] = useState(() => isoDateOffset(30));
  const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  return <CalculatorShell><div className="form-grid"><Field label="시작일" type="date" value={start} onChange={setStart} /><Field label="종료일" type="date" value={end} onChange={setEnd} /></div><ResultCard label="두 날짜의 차이" value={`${Math.abs(days).toLocaleString()}일`} rows={[["시작일 포함", `${Math.abs(days) + 1}일`], ["주 단위", `${number.format(Math.abs(days) / 7)}주`]]} /></CalculatorShell>;
}

function DdayCalculator() {
  const [target, setTarget] = useState(() => isoDateOffset(30));
  const [today] = useState(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  });
  const days = Math.ceil((new Date(target).getTime() - today.getTime()) / 86400000);
  return <CalculatorShell><Field label="목표일" type="date" value={target} onChange={setTarget} /><ResultCard label="오늘부터 목표일까지" value={days === 0 ? "D-day" : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`} /></CalculatorShell>;
}

function AgeCalculator() {
  const [birth, setBirth] = useState("1990-01-01");
  const [today] = useState(() => new Date());
  const birthDate = new Date(birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age -= 1;
  return <CalculatorShell><Field label="생년월일" type="date" value={birth} onChange={setBirth} /><ResultCard label="현재 만 나이" value={`만 ${Math.max(0, age)}세`} rows={[["연 나이", `${Math.max(0, today.getFullYear() - birthDate.getFullYear())}세`]]} /></CalculatorShell>;
}

type UnitDefinition = {
  code: string;
  label: string;
  symbol: string;
  factor: number;
};

const LENGTH_UNITS: UnitDefinition[] = [
  { code: "nm", label: "나노미터", symbol: "nm", factor: 1e-9 },
  { code: "um", label: "마이크로미터", symbol: "μm", factor: 1e-6 },
  { code: "mm", label: "밀리미터", symbol: "mm", factor: 0.001 },
  { code: "cm", label: "센티미터", symbol: "cm", factor: 0.01 },
  { code: "m", label: "미터", symbol: "m", factor: 1 },
  { code: "km", label: "킬로미터", symbol: "km", factor: 1000 },
  { code: "in", label: "인치", symbol: "in", factor: 0.0254 },
  { code: "ft", label: "피트", symbol: "ft", factor: 0.3048 },
  { code: "yd", label: "야드", symbol: "yd", factor: 0.9144 },
  { code: "mi", label: "마일", symbol: "mi", factor: 1609.344 },
  { code: "nmi", label: "해리", symbol: "nmi", factor: 1852 },
  { code: "ja", label: "자", symbol: "자", factor: 0.30303 },
  { code: "ri", label: "리", symbol: "리", factor: 392.7273 },
];

const AREA_UNITS: UnitDefinition[] = [
  { code: "mm2", label: "제곱밀리미터", symbol: "mm²", factor: 0.000001 },
  { code: "cm2", label: "제곱센티미터", symbol: "cm²", factor: 0.0001 },
  { code: "m2", label: "제곱미터", symbol: "m²", factor: 1 },
  { code: "km2", label: "제곱킬로미터", symbol: "km²", factor: 1_000_000 },
  { code: "pyeong", label: "평", symbol: "평", factor: 3.305785 },
  { code: "are", label: "아르", symbol: "a", factor: 100 },
  { code: "ha", label: "헥타르", symbol: "ha", factor: 10_000 },
  { code: "acre", label: "에이커", symbol: "acre", factor: 4046.8564224 },
  { code: "in2", label: "제곱인치", symbol: "in²", factor: 0.00064516 },
  { code: "ft2", label: "제곱피트", symbol: "ft²", factor: 0.09290304 },
  { code: "yd2", label: "제곱야드", symbol: "yd²", factor: 0.83612736 },
];

const VOLUME_UNITS: UnitDefinition[] = [
  { code: "ml", label: "밀리리터", symbol: "mL", factor: 0.001 },
  { code: "cl", label: "센티리터", symbol: "cL", factor: 0.01 },
  { code: "dl", label: "데시리터", symbol: "dL", factor: 0.1 },
  { code: "l", label: "리터", symbol: "L", factor: 1 },
  { code: "cm3", label: "세제곱센티미터", symbol: "cm³", factor: 0.001 },
  { code: "m3", label: "세제곱미터", symbol: "m³", factor: 1000 },
  { code: "tsp", label: "작은술 (미국)", symbol: "tsp", factor: 0.0049289216 },
  { code: "tbsp", label: "큰술 (미국)", symbol: "tbsp", factor: 0.0147867648 },
  { code: "cup", label: "컵 (미국)", symbol: "cup", factor: 0.2365882365 },
  { code: "floz", label: "액량 온스 (미국)", symbol: "fl oz", factor: 0.0295735296 },
  { code: "pt", label: "파인트 (미국)", symbol: "pt", factor: 0.473176473 },
  { code: "qt", label: "쿼트 (미국)", symbol: "qt", factor: 0.946352946 },
  { code: "gal", label: "갤런 (미국)", symbol: "gal", factor: 3.785411784 },
  { code: "in3", label: "세제곱인치", symbol: "in³", factor: 0.016387064 },
  { code: "ft3", label: "세제곱피트", symbol: "ft³", factor: 28.316846592 },
];

function formatConverted(value: number) {
  if (!Number.isFinite(value)) return "0";
  const absolute = Math.abs(value);
  if (absolute !== 0 && (absolute < 0.000001 || absolute >= 1_000_000_000)) {
    return value.toExponential(8).replace(/\.?0+e/, "e");
  }
  return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 10 }).format(value);
}

function UnitConverter({
  units, defaultFrom, defaultTo, note,
}: {
  units: UnitDefinition[];
  defaultFrom: string;
  defaultTo: string;
  note: string;
}) {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const fromUnit = units.find((unit) => unit.code === from) || units[0];
  const toUnit = units.find((unit) => unit.code === to) || units[1];
  const converted = parseNumber(amount) * fromUnit.factor / toUnit.factor;
  function swap() {
    setFrom(to);
    setTo(from);
  }
  return (
    <CalculatorShell note={note}>
      <Field label="변환할 값" value={amount} onChange={setAmount} suffix={fromUnit.symbol} />
      <div className="unit-row">
        <label className="unit-field">
          <span>변환 전 단위</span>
          <select value={from} onChange={(event) => setFrom(event.target.value)}>
            {units.map((unit) => <option key={unit.code} value={unit.code}>{unit.label} ({unit.symbol})</option>)}
          </select>
        </label>
        <button className="swap-button" type="button" onClick={swap} aria-label="변환 단위 서로 바꾸기">⇄</button>
        <label className="unit-field">
          <span>변환 후 단위</span>
          <select value={to} onChange={(event) => setTo(event.target.value)}>
            {units.map((unit) => <option key={unit.code} value={unit.code}>{unit.label} ({unit.symbol})</option>)}
          </select>
        </label>
      </div>
      <ResultCard
        label={`${fromUnit.label} → ${toUnit.label}`}
        value={`${formatConverted(converted)} ${toUnit.symbol}`}
        sub={`1 ${fromUnit.symbol} = ${formatConverted(fromUnit.factor / toUnit.factor)} ${toUnit.symbol}`}
      />
    </CalculatorShell>
  );
}

const CURRENCY_LABELS: Record<string, string> = {
  EUR: "유로", USD: "미국 달러", JPY: "일본 엔", BGN: "불가리아 레프",
  CZK: "체코 코루나", DKK: "덴마크 크로네", GBP: "영국 파운드", HUF: "헝가리 포린트",
  PLN: "폴란드 즈워티", RON: "루마니아 레우", SEK: "스웨덴 크로나", CHF: "스위스 프랑",
  ISK: "아이슬란드 크로나", NOK: "노르웨이 크로네", TRY: "튀르키예 리라", AUD: "호주 달러",
  BRL: "브라질 헤알", CAD: "캐나다 달러", CNY: "중국 위안", HKD: "홍콩 달러",
  IDR: "인도네시아 루피아", ILS: "이스라엘 셰켈", INR: "인도 루피", KRW: "대한민국 원",
  MXN: "멕시코 페소", MYR: "말레이시아 링깃", NZD: "뉴질랜드 달러", PHP: "필리핀 페소",
  SGD: "싱가포르 달러", THB: "태국 바트", ZAR: "남아프리카공화국 랜드",
};

type ExchangeResponse = { date?: string; rates?: Record<string, number>; message?: string };

function CurrencyCalculator() {
  const [amount, setAmount] = useState("1000000");
  const [from, setFrom] = useState("KRW");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("최신 기준환율을 불러오고 있어요…");

  useEffect(() => {
    let active = true;
    fetch("/api/exchange")
      .then(async (response) => {
        const body = await response.json() as ExchangeResponse;
        if (!response.ok || !body.rates) throw new Error(body.message || "환율 정보를 불러오지 못했습니다.");
        if (active) {
          setRates(body.rates);
          setDate(body.date || "");
          setStatus("");
        }
      })
      .catch((error: unknown) => {
        if (active) setStatus(error instanceof Error ? error.message : "환율 정보를 불러오지 못했습니다.");
      });
    return () => { active = false; };
  }, []);

  const codes = Object.keys(CURRENCY_LABELS).filter((code) => rates[code]);
  const converted = rates[from] && rates[to] ? parseNumber(amount) / rates[from] * rates[to] : 0;
  const resultFormatter = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 4 });
  function swap() {
    setFrom(to);
    setTo(from);
  }
  return (
    <CalculatorShell note="유럽중앙은행(ECB) 기준환율을 이용한 참고용 환산입니다. 카드사·은행의 실시간 매매기준율, 수수료 및 환전 우대는 반영되지 않습니다.">
      <Field label="환전할 금액" value={amount} onChange={setAmount} suffix={from} />
      <div className="unit-row">
        <label className="unit-field">
          <span>보내는 통화</span>
          <select value={from} onChange={(event) => setFrom(event.target.value)} disabled={!codes.length}>
            {(codes.length ? codes : Object.keys(CURRENCY_LABELS)).map((code) => <option key={code} value={code}>{CURRENCY_LABELS[code]} ({code})</option>)}
          </select>
        </label>
        <button className="swap-button" type="button" onClick={swap} aria-label="통화 서로 바꾸기">⇄</button>
        <label className="unit-field">
          <span>받는 통화</span>
          <select value={to} onChange={(event) => setTo(event.target.value)} disabled={!codes.length}>
            {(codes.length ? codes : Object.keys(CURRENCY_LABELS)).map((code) => <option key={code} value={code}>{CURRENCY_LABELS[code]} ({code})</option>)}
          </select>
        </label>
      </div>
      {status
        ? <p className="status-message">{status}</p>
        : <ResultCard
            label={`${CURRENCY_LABELS[from]} → ${CURRENCY_LABELS[to]}`}
            value={`${resultFormatter.format(converted)} ${to}`}
            sub={`${date} ECB 기준 · 1 ${from} = ${resultFormatter.format(rates[to] / rates[from])} ${to}`}
          />}
    </CalculatorShell>
  );
}

function CharacterCalculator() {
  const [text, setText] = useState("");
  const bytes = new TextEncoder().encode(text).length;
  return <CalculatorShell><label className="textarea-field"><span>텍스트</span><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="글자 수를 확인할 내용을 입력하세요" /></label><ResultCard label="공백 포함 글자 수" value={`${text.length.toLocaleString()}자`} rows={[["공백 제외", `${text.replace(/\s/g, "").length.toLocaleString()}자`], ["UTF-8 바이트", `${bytes.toLocaleString()} bytes`], ["줄 수", `${text ? text.split(/\r\n|\r|\n/).length : 0}줄`]]} /></CalculatorShell>;
}

function renderCalculator(id: string) {
  switch (id) {
    case "salary": return <SalaryCalculator />;
    case "monthly": return <SalaryCalculator monthly />;
    case "raise": return <RaiseCalculator />;
    case "hourly": return <HourlyCalculator />;
    case "address": return <AddressCalculator />;
    case "percentage": return <PercentageCalculator />;
    case "discount": return <DiscountCalculator />;
    case "vat": return <VatCalculator />;
    case "dutch": return <DutchCalculator />;
    case "date": return <DateDifferenceCalculator />;
    case "dday": return <DdayCalculator />;
    case "age": return <AgeCalculator />;
    case "currency": return <CurrencyCalculator />;
    case "length": return <UnitConverter units={LENGTH_UNITS} defaultFrom="m" defaultTo="ft" note="국제 단위계와 공인 환산계수를 기준으로 계산합니다. 전통 단위인 자·리는 관용 환산값입니다." />;
    case "area": return <UnitConverter units={AREA_UNITS} defaultFrom="pyeong" defaultTo="m2" note="1평은 약 3.305785㎡입니다. 부동산 계약에서는 공시된 전용·공급면적을 함께 확인하세요." />;
    case "volume": return <UnitConverter units={VOLUME_UNITS} defaultFrom="l" defaultTo="gal" note="컵·큰술·작은술·갤런은 미국식 단위를 적용합니다. 영국식 단위와 값이 다를 수 있습니다." />;
    case "characters": return <CharacterCalculator />;
    default: return null;
  }
}

export default function ToolPageClient({ tool }: { tool: Tool }) {
  const related = tools.filter((item) => item.id !== tool.id && item.category === tool.category).slice(0, 3);
  const guides = toolGuides[tool.id] || [];
  const faqs = toolFaqs[tool.id] || [];
  const practicalGuide = practicalGuides.find((guide) => guide.toolId === tool.id);
  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand"><span className="brand-mark">=</span><span>바로계산</span></Link>
        <Link href="/" className="header-link">도구 검색</Link>
      </header>
      <div className="tool-page">
        <nav className="breadcrumb"><Link href="/">홈</Link><span>/</span><span>{tool.category}</span></nav>
        <section className="tool-intro">
          <span className={`tool-glyph tone-${tool.tone}`}>{tool.glyph}</span>
          <div><p>{tool.category}</p><h1>{tool.name}</h1><span>{tool.description}</span></div>
        </section>
        {renderCalculator(tool.id)}
        <div className="privacy-note"><span>✓</span><div><strong>입력값을 저장하지 않아요</strong><p>계산은 사용 중인 브라우저에서 처리되며 입력한 값은 서버에 저장하지 않습니다.</p></div></div>
        <SharePanel
          title={tool.name}
          text={`${tool.description}. 가입 없이 바로 사용할 수 있어요.`}
          path={tool.path}
        />
        <section className="guide-section">
          <span>Guide</span>
          <h2>{tool.name} 사용 방법</h2>
          {guides.map((guide) => <p key={guide}>{guide}</p>)}
          {tool.id === "salary" && <p>2026년 국민연금 근로자 부담률 4.75%, 건강보험 직장가입자 근로자 부담률 3.595%를 반영했습니다. 개인별 비과세 항목과 부양가족, 세액공제에 따라 실제 소득세는 달라집니다.</p>}
        </section>
        {faqs.length > 0 && (
          <section className="faq-section">
            <span>FAQ</span>
            <h2>자주 묻는 질문</h2>
            <div>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        {practicalGuide && (
          <aside className="tool-guide-link">
            <div><span>관련 가이드</span><strong>{practicalGuide.title}</strong><p>{practicalGuide.description}</p></div>
            <Link href={`/guides/${practicalGuide.slug}`}>가이드 읽기 →</Link>
          </aside>
        )}
        <section className="related-section">
          <h2>함께 쓰면 좋은 도구</h2>
          <div>
            {related.map((item) => <Link key={item.id} href={item.path}><span className={`tool-glyph tone-${item.tone}`}>{item.glyph}</span><span><strong>{item.name}</strong><small>{item.description}</small></span><i>→</i></Link>)}
          </div>
        </section>
      </div>
      <footer>
        <Link href="/" className="brand footer-brand"><span className="brand-mark">=</span><span>바로계산</span></Link>
        <p>복잡한 계산을 가장 간단하게.</p>
        <nav><Link href="/">도구 검색</Link><Link href="/guides">생활 가이드</Link><Link href="/about">사이트 소개</Link><Link href="/terms">이용약관</Link><Link href="/privacy">개인정보처리방침</Link></nav>
        <small>© 2026 바로계산. 계산 결과는 참고용입니다.</small>
      </footer>
    </main>
  );
}
