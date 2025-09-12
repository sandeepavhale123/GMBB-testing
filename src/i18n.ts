// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const namespaces = [
  "Profile/profile",
  "Profile/profileHeader",
  "Profile/profileBasicInfoForm",
  "Profile/profilePreferencesForm",
];

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  ns: namespaces,
  lng: "en", // default language; can be overridden at runtime
  defaultNS: "Profile/profile",
  interpolation: { escapeValue: false },
  resources: {}, // we’ll dynamically load JSON
  parseMissingKeyHandler: (key) => {
    // Friendly fallback instead of showing raw `Profile/profileHeader.firstName`
    return key.split(".").slice(-1)[0];
  },
});

// Load a single namespace JSON for a given language
export async function loadNamespace(lng: string, ns: string) {
  try {
    const data = await import(
      /* @vite-ignore */ `./language/${lng}/${ns}.json`
    );
    const translations = (data && (data as any).default) || data;
    if (!i18n.hasResourceBundle(lng, ns)) {
      i18n.addResourceBundle(lng, ns, translations, true, true);
    }
    return true;
  } catch (err) {
    console.warn(`⚠️ Missing translations: ${lng}/${ns}.json`, err);
    return false;
  }
}

// Load all known namespaces for a given language (helper)
export async function loadAllNamespaces(lng: string) {
  return Promise.all(namespaces.map((ns) => loadNamespace(lng, ns)));
}

export default i18n;
