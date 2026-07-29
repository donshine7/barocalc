import assert from "node:assert/strict";
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
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders an independent salary calculator route", async () => {
  const response = await render("/salary/net-pay");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /연봉 실수령액 계산기/);
  assert.match(html, /2026년 기준 예상 월급과 공제액 계산/);
  assert.match(html, /부양가족 수 \(본인 포함\)/);
  assert.match(html, /적용 소득세율/);
  assert.match(html, /입력값을 저장하지 않아요/);
});

test("server-renders the expanded unit converters", async () => {
  for (const [path, title, expectedUnit] of [
    ["/unit/length", "길이 변환기", "해리"],
    ["/unit/area", "면적·평수 변환기", "헥타르"],
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
  assert.match(await currencyResponse.text(), /실시간 환율 변환기/);

  const addressResponse = await render("/life/address");
  assert.equal(addressResponse.status, 200);
  const addressHtml = await addressResponse.text();
  assert.match(addressHtml, /한글 주소 → 영문 주소 변환기/);
  assert.match(addressHtml, /한글 주소로 찾기/);
});
