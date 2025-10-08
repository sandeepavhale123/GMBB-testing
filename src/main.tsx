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

// Get persisted language from i18next (LanguageDetector will read localStorage automatically)
const initialLang = i18n.language || "en";

// Preload all i18n namespaces before rendering
preloadNamespaces(initialLang);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
