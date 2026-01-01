// src/hooks/usePublicI18n.ts
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import i18n, { loadNamespace } from "@/i18n";
import { languageMap } from "@/lib/languageMap";

/**
 * usePublicI18n ensures the requested namespace(s) are loaded for:
 *  - Language from URL (?lang=xx)
 *  - English (fallback)
 *
 * Returns a safe t(key, opts) with fallback order:
 *   1) URL language
 *   2) English
 *   3) opts.defaultValue
 *   4) raw key
 *
 *   Additionally returns the full language name (e.g. "English")
 * Usage:
 *   const { t, loaded } = usePublicI18n("PublicReport/header");
 */
export function usePublicI18n(ns: string | string[]) {
  const [searchParams] = useSearchParams();
  const urlLang = searchParams.get("lang") || "en"; // language from URL
  const nsArray = Array.isArray(ns) ? ns : [ns];

  useTranslation(nsArray as any);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Always load English first (fallback)
      await Promise.all(
        nsArray.map((n) =>
          i18n.hasResourceBundle("en", n) ? null : loadNamespace("en", n)
        )
      );

      // Load URL language if different from English
      if (urlLang !== "en") {
        await Promise.all(
          nsArray.map((n) =>
            i18n.hasResourceBundle(urlLang, n)
              ? null
              : loadNamespace(urlLang, n)
          )
        );
      }

      if (mounted) setLoaded(true);
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlLang, JSON.stringify(nsArray)]);

  const safeT = (key: string, options?: any) => {
    // Try URL language first
    for (const n of nsArray) {
      if (i18n.exists(key, { ns: n, lng: urlLang })) {
        return i18n.t(key, { ns: n, lng: urlLang, ...options });
      }
    }

    // Fallback to English
    for (const n of nsArray) {
      if (i18n.exists(key, { ns: n, lng: "en" })) {
        return i18n.t(key, { ns: n, lng: "en", ...options });
      }
    }

    // Fallback to explicit defaultValue
    if (options?.defaultValue) return options.defaultValue;

    // Last resort: raw key
    return key;
  };

  // 🔄 Reverse map: convert language code → full name
  const codeToNameMap = Object.fromEntries(
    Object.entries(languageMap).map(([name, code]) => [
      code,
      name.charAt(0).toUpperCase() + name.slice(1),
    ])
  );

  const languageFullName = codeToNameMap[urlLang] || "English";

  return { t: safeT, i18n, loaded, lang: urlLang, languageFullName };
}
