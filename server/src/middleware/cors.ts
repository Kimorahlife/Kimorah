import cors from "cors";
import config from "../config";

const isProd = process.env.NODE_ENV === "production";
const localhostRe = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export const corsMiddleware = cors({
  origin(origin, callback) {
    // No Origin header (curl, same-origin, server-to-server) — allow.
    if (!origin) return callback(null, true);
    // The configured allowed origin (production frontend).
    if (origin === config.ORIGIN_URL) return callback(null, true);
    // In development, allow any localhost port — Vite falls back to 5174/5175
    // etc. when 5173 is taken, and the origin must still be accepted.
    if (!isProd && localhostRe.test(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
