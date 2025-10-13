import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { applyStoredTheme } from "./utils/themeUtils";
import { preloadNamespaces } from "./i18n";
import i18n from "./i18n";

const queryClient = new QueryClient();

// Apply stored theme on app startup
applyStoredTheme();

const savedLang = localStorage.getItem("i18nextLng") || "en";

// ✅ Important: explicitly set language BEFORE rendering
await i18n.changeLanguage(savedLang);

// ✅ Then preload namespaces
preloadNamespaces(savedLang);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
