import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ✅ Read version from environment (created in package.json build step)
const buildVersion = process.env.VITE_BUILD_VERSION || Date.now().toString();

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // 🧩 Inject build version for cache-busting and debugging
    __BUILD_VERSION__: JSON.stringify(buildVersion),
    // 🔧 Polyfill Node.js global for browser compatibility (required by react-form-builder2)
    global: 'globalThis',
  },
}));
