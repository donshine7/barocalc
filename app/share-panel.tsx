"use client";

import { useState } from "react";

type SharePanelProps = {
  title: string;
  text: string;
  path: string;
  compact?: boolean;
};

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

function shareUrl(path: string) {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "tool_share");
  return url.toString();
}

function trackShare(method: string, path: string) {
  (window as AnalyticsWindow).gtag?.("event", "share", {
    method,
    content_type: path === "/" ? "website" : "calculator",
    item_id: path,
  });
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export default function SharePanel({ title, text, path, compact = false }: SharePanelProps) {
  const [status, setStatus] = useState("");

  async function copyLink() {
    try {
      await copyText(shareUrl(path));
      trackShare("copy_link", path);
      setStatus("링크를 복사했어요.");
    } catch {
      setStatus("링크 복사에 실패했어요. 주소창의 URL을 복사해 주세요.");
    }
  }

  async function share() {
    const url = shareUrl(path);
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, text, url });
      trackShare("web_share", path);
      setStatus("공유했어요. 감사합니다!");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyLink();
    }
  }

  return (
    <section className={`share-panel${compact ? " share-panel-compact" : ""}`} aria-label="공유하기">
      <div className="share-copy">
        <span>Share</span>
        <strong>{compact ? "친구에게 바로계산 알려주기" : `${title} 친구에게 공유하기`}</strong>
        <p>{compact ? "가입 없이 바로 쓰는 계산 도구를 필요한 사람에게 보내보세요." : "유용했다면 같은 계산이 필요한 사람에게 링크를 보내주세요."}</p>
      </div>
      <div className="share-controls">
        <button type="button" className="share-primary" onClick={share}>공유하기</button>
        <button type="button" className="share-secondary" onClick={copyLink}>링크 복사</button>
        {status && <span className="share-status" role="status">{status}</span>}
      </div>
    </section>
  );
}
