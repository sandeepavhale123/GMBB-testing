import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { applyStoredTheme } from "./utils/themeUtils";
import { preloadNamespaces } from "./i18n";

const queryClient = new QueryClient();

// Apply stored theme on app startup
applyStoredTheme();

// Preload all i18n namespaces (now synchronous with eager imports)
preloadNamespaces();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
