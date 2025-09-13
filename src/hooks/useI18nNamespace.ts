// src/hooks/useI18nNamespace.ts
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { loadNamespace } from "@/i18n";

/**
 * useI18nNamespace ensures the requested namespace(s) are loaded for:
 *  - English (fallback)
 *  - current i18n.language
 *
 * Returns a "safe" t(key, opts) with fallback order:
 *   1) current language
 *   2) English
 *   3) opts.defaultValue
 *   4) raw key
 *
 * Usage:
 *   const { t } = useI18nNamespace("Profile/profileHeader");
 */
export function useI18nNamespace(ns: string | string[]) {
  const nsArray = Array.isArray(ns) ? ns : [ns];
  useTranslation(nsArray as any);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const current = i18n.language || "en";

      // Always load English first (fallback base)
      await Promise.all(
        nsArray.map((n) =>
          i18n.hasResourceBundle("en", n) ? null : loadNamespace("en", n)
        )
      );

      // Then load current language if different
      if (current !== "en") {
        await Promise.all(
          nsArray.map((n) =>
            i18n.hasResourceBundle(current, n)
              ? null
              : loadNamespace(current, n)
          )
        );
      }

      if (mounted) setLoaded(true);
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, JSON.stringify(nsArray)]);

  const safeT = (key: string, options?: any) => {
    const current = i18n.language || "en";

    // Try current language first
    for (const n of nsArray) {
      if (i18n.exists(key, { ns: n, lng: current })) {
        return i18n.t(key, { ns: n, lng: current, ...options });
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

    // Last resort: raw key (helps spot missing translations)
    return key;
  };

  return { t: safeT, i18n, loaded };
}
