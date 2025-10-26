// src/hooks/useI18nNamespace.ts
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { loadNamespace } from "@/i18n";
import { languageMap } from "@/lib/languageMap";

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
 *  - loaded (boolean)
 *  - lang (current code, e.g. "en")
 *  - languageFullName (e.g. "English")
 * Usage:
 *   const { t } = useI18nNamespace("Profile/profileHeader");
 */
export function useI18nNamespace(ns: string | string[]) {
  const nsArray = Array.isArray(ns) ? ns : [ns];
  useTranslation(nsArray as any);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const current = i18n.language || "en";

    // Load English first (fallback base) - now synchronous
    nsArray.forEach((n) => {
      if (!i18n.hasResourceBundle("en", n)) {
        loadNamespace("en", n);
      }
    });

    // Then load current language if different
    if (current !== "en") {
      nsArray.forEach((n) => {
        if (!i18n.hasResourceBundle(current, n)) {
          loadNamespace(current, n);
        }
      });
    }

    setLoaded(true);
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
  // 🔄 Reverse languageMap (convert code → name)
  // Current languageMap is: { english: "en", spanish: "es", ... }
  const codeToNameMap = Object.fromEntries(
    Object.entries(languageMap).map(([name, code]) => [
      code,
      name.charAt(0).toUpperCase() + name.slice(1),
    ])
  );

  const lang = i18n.language || "en";
  const languageFullName = codeToNameMap[lang] || "English";

  return { t: safeT, i18n, loaded, languageFullName };
}
