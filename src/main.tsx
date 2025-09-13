import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyStoredTheme } from "./utils/themeUtils";
import { preloadNamespaces } from "./i18n";

// Apply stored theme on app startup
applyStoredTheme();

// Preload all i18n namespaces before rendering the app
preloadNamespaces().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
