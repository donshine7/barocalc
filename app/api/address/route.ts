import { NextRequest, NextResponse } from "next/server";

function compactAddress(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/[^0-9a-z가-힣]/g, "");
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const mode = request.nextUrl.searchParams.get("mode") === "en" ? "en" : "ko";
  const key = process.env.JUSO_API_KEY;
  if (!key) {
    return NextResponse.json(
      { message: "주소 검색 준비가 아직 끝나지 않았어요. 운영자가 공식 주소 API 승인키를 연결하면 사용할 수 있습니다." },
      { status: 503 },
    );
  }
  if (query.length < 2 || query.length > 80 || /[%=><[\]]/.test(query)) {
    return NextResponse.json({ message: "주소 검색어를 다시 확인해 주세요." }, { status: 400 });
  }
  const endpoint = mode === "en" ? "addrEngApi.do" : "addrEngApi.do";
  const params = new URLSearchParams({
    confmKey: key,
    currentPage: "1",
    countPerPage: "10",
    keyword: query,
    resultType: "json",
  });
  try {
    const response = await fetch(`https://business.juso.go.kr/addrlink/${endpoint}?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("upstream");
    const data = await response.json() as {
      results?: { common?: { errorCode?: string; errorMessage?: string }; juso?: Array<Record<string, string>> };
    };
    const common = data.results?.common;
    if (common?.errorCode && common.errorCode !== "0") {
      return NextResponse.json({ message: common.errorMessage || "공식 주소 검색에 실패했습니다." }, { status: 400 });
    }
    const mappedItems = (data.results?.juso || []).map((item) => ({
      roadAddr: item.korAddr || item.roadFullAddr || item.roadAddr,
      jibunAddr: item.jibunAddr,
      engAddr: item.roadAddr || item.engAddr,
      zipNo: item.zipNo,
    }));
    const uniqueItems = mappedItems.filter((item, index, items) => {
      const identity = `${item.zipNo}|${item.roadAddr}|${item.engAddr}`;
      return items.findIndex((candidate) =>
        `${candidate.zipNo}|${candidate.roadAddr}|${candidate.engAddr}` === identity
      ) === index;
    });
    const compactQuery = compactAddress(query);
    const exactItems = /\d/.test(query)
      ? uniqueItems.filter((item) => compactAddress(mode === "en" ? item.engAddr || "" : item.roadAddr || "").includes(compactQuery))
      : [];
    const items = exactItems.length > 0 ? exactItems : uniqueItems;
    return NextResponse.json({ items }, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch {
    return NextResponse.json({ message: "공식 주소 서비스에 잠시 연결할 수 없습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
