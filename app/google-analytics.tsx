"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-EL89Q5P6SW";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    __barocalcAnalyticsInitialized?: boolean;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (window.__barocalcAnalyticsInitialized) return;
    window.__barocalcAnalyticsInitialized = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }, []);

  return null;
}
