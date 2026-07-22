// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env files for the current mode (e.g. .env, .env.local, .env.development)
  // Only vars starting with VITE_ are loaded by default
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const apiBase = env.VITE_API_BASE_URL || "http://localhost:3001";

  return {
    plugins: [react()],
    server: {
      // Pin the dev server to one port. With strictPort, Vite fails loudly if
      // 5173 is taken instead of silently drifting to 5174 and serving a second,
      // stale copy of the app. The `predev` script frees 5173 first so this
      // normally just works.
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
  };
});
