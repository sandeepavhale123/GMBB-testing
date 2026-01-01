import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// ✅ Read version from environment (created in package.json build step)
const buildVersion = process.env.VITE_BUILD_VERSION || Date.now().toString();

export default defineConfig(({ mode }) => ({
  base: '/dist/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // 🧩 Inject build version for cache-busting and debugging
    __BUILD_VERSION__: JSON.stringify(buildVersion),
    // 🔧 Polyfill Node.js global for browser compatibility (required by react-form-builder2)
    global: "globalThis",
  },

  // ✅ esbuild optimization (runs BEFORE Rollup)
  esbuild: {
    drop: ["console", "debugger"], // removes console.log, console.error, console.warn, debugger
    pure: ["console.log"], // mark console.log as side-effect free (more dead-code removal)
  },

  // ✅ Rollup optimization (tree-shaking + dead-code elimination)
  build: {
    target: "esnext",
    minify: "esbuild", // fastest & removes dead code
    modulePreload: true, // helps Rollup determine module graph better

    // Tree-shake CommonJS libraries like lodash, date-fns/locale, etc.
    commonjsOptions: {
      transformMixedEsModules: true,
      treeshake: true,
    },

    // Force aggressive tree-shaking in Rollup
    rollupOptions: {
      treeshake: "recommended",

      output: {
        manualChunks: {
          // Split react ecosystem
          "vendor-react": ["react", "react-dom", "react-router-dom"],

          // UI components (Radix)
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
          ],

          // Charting library chunk
          "vendor-charts": ["recharts"],

          // Forms and validation
          "vendor-form": ["react-hook-form", "zod", "@hookform/resolvers"],
        },
      },
    },
  },
}));
