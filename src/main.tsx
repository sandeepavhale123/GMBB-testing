import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { applyStoredTheme } from "./utils/themeUtils";
import { preloadNamespaces } from "./i18n";
import i18n from "./i18n";

const queryClient = new QueryClient();

// 🧩 STEP 1: Cache-refresh check for new build version (no localStorage clearing)
const currentVersion = import.meta.env.VITE_BUILD_VERSION || "";
const storedVersion = localStorage.getItem("app_version");

if (storedVersion !== currentVersion) {
  // ✅ Clear only browser caches (JS/CSS/service worker files)
  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.forEach((k) => caches.delete(k));
    });
  }

  // ✅ Keep localStorage and sessionStorage data intact
  localStorage.setItem("app_version", currentVersion);

  // ✅ Reload page once to pick up latest files
  window.location.reload();
}

// 🧩 STEP 2: Apply theme & language setup
applyStoredTheme();

const savedLang = localStorage.getItem("i18nextLng") || "en";

// Set language before rendering
i18n.changeLanguage(savedLang);
preloadNamespaces(savedLang);

// 🧩 STEP 3: Render App
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
