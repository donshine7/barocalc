import { NextResponse } from "next/server";

const ECB_DAILY_RATES = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

export async function GET() {
  try {
    const response = await fetch(ECB_DAILY_RATES, {
      headers: { Accept: "application/xml,text/xml" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("ECB unavailable");
    const xml = await response.text();
    const date = xml.match(/time=['"]([^'"]+)['"]/)?.[1] || "";
    const rates: Record<string, number> = { EUR: 1 };
    for (const match of xml.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([0-9.]+)['"]/g)) {
      rates[match[1]] = Number(match[2]);
    }
    if (!rates.USD || !rates.KRW) throw new Error("Invalid ECB response");
    return NextResponse.json(
      { base: "EUR", date, rates },
      { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json(
      { message: "기준환율을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
