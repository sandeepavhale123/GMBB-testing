// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Static import all translation files at build time (fixes production issue)
const translationModules = import.meta.glob("./language/**/*.json", {
  eager: true,
});

// Extract all available namespaces from the translation files
const extractedNamespaces = new Set<string>();
Object.keys(translationModules).forEach((path) => {
  // Extract namespace from path: ./language/en/Profile/profile.json -> Profile/profile
  const match = path.match(/\.\/language\/[^/]+\/(.+)\.json$/);
  if (match) {
    extractedNamespaces.add(match[1]);
  }
});

export const namespaces = Array.from(extractedNamespaces);

i18n
  .use(LanguageDetector) // Detect and persist language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: namespaces,
    // lng: "en", // default language; can be overridden at runtime
    defaultNS: "Profile/profile",
    interpolation: { escapeValue: false },
    resources: {}, // we'll load from pre-bundled modules
    detection: {
      // order in which i18next tries to detect language
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"], // persist in localStorage
    },
    parseMissingKeyHandler: (key) => {
      // Friendly fallback instead of showing raw `Profile/profileHeader.firstName`
      return key.split(".").slice(-1)[0];
    },
  });

// Load a single namespace JSON for a given language using pre-loaded modules
export function loadNamespace(lng: string, ns: string): boolean {
  try {
    const path = `./language/${lng}/${ns}.json`;
    const module = translationModules[path];

    if (module && !i18n.hasResourceBundle(lng, ns)) {
      const translations = (module as any).default || module;
      i18n.addResourceBundle(lng, ns, translations, true, true);
      return true;
    }

    if (!module) {
      console.warn(`⚠️ Missing translations: ${lng}/${ns}.json`);
      return false;
    }

    return true;
  } catch (err) {
    console.warn(`⚠️ Error loading translations: ${lng}/${ns}.json`, err);
    return false;
  }
}

// Load all known namespaces for a given language (helper)
export function loadAllNamespaces(lng?: string): void {
  const language = lng || i18n.language;
  namespaces.forEach((ns) => loadNamespace(language, ns));
}

// Preload all namespaces before app renders
export function preloadNamespaces(lng?: string): typeof i18n {
  const language = lng || i18n.language;
  loadAllNamespaces(language);
  return i18n;
}

export default i18n;
