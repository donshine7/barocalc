import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function render(path = "/") {
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the calculator search landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /바로계산/);
  assert.match(html, /계산기나 키워드를 검색하세요/);
  assert.match(html, /많이 사용하는 도구/);
  assert.match(html, /친구에게 바로계산 알려주기/);
  assert.match(html, /google-analytics-/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("bundles the GA4 measurement ID in the browser analytics module", async () => {
  const assetsDirectory = new URL("../dist/client/assets/", import.meta.url);
  const analyticsAsset = (await readdir(assetsDirectory)).find((name) => name.startsWith("google-analytics-") && name.endsWith(".js"));
  assert.ok(analyticsAsset);
  assert.match(await readFile(new URL(analyticsAsset, assetsDirectory), "utf8"), /G-EL89Q5P6SW/);
});

test("bundles privacy-safe calculator interaction events", async () => {
  const assetsDirectory = new URL("../dist/client/assets/", import.meta.url);
  const calculatorAsset = (await readdir(assetsDirectory)).find((name) => name.startsWith("tool-page-client-") && name.endsWith(".js"));
  assert.ok(calculatorAsset);
  const source = await readFile(new URL(calculatorAsset, assetsDirectory), "utf8");
  assert.match(source, /calculator_use/);
  assert.match(source, /calculator_preset/);
  assert.match(source, /address_search/);
  assert.match(source, /result_copy/);
});

test("publishes the Analytics disclosure", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Google Analytics 4/);
  assert.match(html, /계산기에 입력한 연봉, 주소, 금액 등의 값은 Analytics 이벤트로 전송하지 않습니다/);
});

test("server-renders an independent salary calculator route", async () => {
  const response = await render("/salary/net-pay");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /연봉 실수령액 계산기/);
  assert.match(html, /2026년 보험료율·부양가족을 반영한 예상 월급과 공제액/);
  assert.match(html, /부양가족 수 \(본인 포함\)/);
  assert.match(html, /적용 소득세율/);
  assert.match(html, /국민연금공단 기준/);
  assert.match(html, /입력값을 저장하지 않아요/);
  assert.match(html, /연봉 실수령액 계산기 친구에게 공유하기/);
  assert.match(html, /부양가족 수에는 본인도 포함하나요/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /연봉 실수령액 계산기 \| 바로계산/);
  assert.doesNotMatch(html, /og-v2\.png/);

  const structuredDataMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(structuredDataMatch);
  const structuredData = JSON.parse(structuredDataMatch[1]);
  const breadcrumb = structuredData.find((item) => item["@type"] === "BreadcrumbList");
  assert.deepEqual(breadcrumb.itemListElement, [
    { "@type": "ListItem", position: 1, name: "홈", item: "https://barocalc.co.kr" },
    {
      "@type": "ListItem",
      position: 2,
      name: "연봉 실수령액 계산기",
      item: "https://barocalc.co.kr/salary/net-pay",
    },
  ]);
});

test("server-renders the expanded unit converters", async () => {
  for (const [path, title, expectedUnit] of [
    ["/unit/length", "길이 변환기", "해리"],
    ["/unit/area", "평수 계산기 — ㎡·평 면적 변환", "헥타르"],
    ["/unit/volume", "부피·용량 변환기", "갤런"],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(title));
    assert.match(html, new RegExp(expectedUnit));
    assert.match(html, /변환 전 단위/);
  }
});

test("server-renders currency and Korean-to-English address tools", async () => {
  const currencyResponse = await render("/unit/currency");
  assert.equal(currencyResponse.status, 200);
  assert.match(await currencyResponse.text(), /환율 계산기 — 달러·엔화·유로 원화 변환/);

  const addressResponse = await render("/life/address");
  assert.equal(addressResponse.status, 200);
  const addressHtml = await addressResponse.text();
  assert.match(addressHtml, /한글 주소 → 영문 주소 변환기/);
  assert.match(addressHtml, /한글 주소로 찾기/);
  assert.match(addressHtml, /세종대로 110/);
});

test("server-renders practical guides and connects them to calculators", async () => {
  const guideResponse = await render("/guides/84-square-meter-to-pyeong");
  assert.equal(guideResponse.status, 200);
  const guideHtml = await guideResponse.text();
  assert.match(guideHtml, /84㎡ 몇 평\? 25\.4평과 33·34평형의 차이/);
  assert.match(guideHtml, /전용면적·공급면적·계약면적/);
  assert.match(guideHtml, /㎡와 평을 바로 변환하기/);
  assert.match(guideHtml, /application\/ld\+json/);
  assert.match(guideHtml, /84㎡ 몇 평\? 25\.4평과 33·34평형의 차이 \| 바로계산/);
  assert.doesNotMatch(guideHtml, /og-v2\.png/);

  const areaResponse = await render("/unit/area");
  const areaHtml = await areaResponse.text();
  assert.match(areaHtml, /관련 가이드/);
  assert.match(areaHtml, /84㎡ 몇 평\? 25\.4평과 33·34평형의 차이/);
  assert.match(areaHtml, /많이 찾는 면적/);
});

test("sitemap publishes the custom domain and practical guides", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.match(xml, /https:\/\/barocalc\.co\.kr\/guides\/salary-5000-net-pay/);
  assert.doesNotMatch(xml, /chatgpt\.site/);
});
