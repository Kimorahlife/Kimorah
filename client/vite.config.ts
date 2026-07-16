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
      proxy: {
        "/api": {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
  };
});
