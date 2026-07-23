import { Request, Response } from "express";
import mongoose from "mongoose";
import config from "../config";

const isProd = process.env.NODE_ENV === "production";
const localhostRe = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

/** Replicates middleware/cors.ts so the report can tell you if THIS request's
 * origin would be accepted by the real CORS policy. */
const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // no Origin header (server-to-server / same-origin)
  if (origin === config.ORIGIN_URL) return true;
  if (!isProd && localhostRe.test(origin)) return true;
  return false;
};

/**
 * GET /api/health — connectivity + configuration self-check.
 *
 * Reports whether each required env var is present (VALUES of secrets are never
 * returned — only "set"/"MISSING"), the DB connection state, and whether the
 * caller's browser origin passes the CORS policy. Mounted with an always-open
 * CORS wrapper (see index.ts) so a browser on any origin can read this report
 * even when the main policy would block it — that's how you diagnose a CORS
 * mismatch instead of just seeing a blocked request.
 */
export const healthCheck = (req: Request, res: Response): void => {
  const requestOrigin = req.headers.origin as string | undefined;
  const originAllowed = isOriginAllowed(requestOrigin);
  const dbReady = mongoose.connection.readyState === 1;

  res.status(200).json({
    ok: true,
    service: "kimorah-server",
    env: config.env,
    time: new Date().toISOString(),
    db: {
      connected: dbReady,
      state: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] ?? "unknown",
      name: mongoose.connection.name || null,
    },
    // Presence check only — secret values are never echoed.
    config: {
      MONGO_URI: process.env.MONGO_URI ? "set" : "MISSING",
      JWT_SECRET: process.env.JWT_SECRET ? "set" : "MISSING",
      ORIGIN_URL: process.env.ORIGIN_URL || "MISSING", // public URL — safe to show
      PORT: process.env.PORT || "(default 3001)",
      NODE_ENV: process.env.NODE_ENV || "(unset → development)",
    },
    cors: {
      requestOrigin: requestOrigin ?? null,
      allowedOrigin: config.ORIGIN_URL ?? null,
      originAllowed,
      note: requestOrigin
        ? originAllowed
          ? "This origin passes CORS."
          : "This origin is BLOCKED by CORS. Set the server's ORIGIN_URL to exactly this origin."
        : "No Origin header (curl / server-to-server) — CORS does not apply.",
      isProd,
    },
  });
};
