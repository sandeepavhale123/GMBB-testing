import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyStoredTheme } from "./utils/themeUtils";
import "./i18n";

// Apply stored theme on app startup
applyStoredTheme();

createRoot(document.getElementById("root")!).render(<App />);
