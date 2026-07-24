import cors from "cors";
import config from "../config";

const isProd = process.env.NODE_ENV === "production";

/** Extract the lowercase hostname from an origin/URL, tolerating a missing
 * scheme (e.g. a bare "kimorah-life.vercel.app" set in ORIGIN_URL). */
function hostOf(value?: string): string | null {
  if (!value) return null;
  try {
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withScheme).hostname.toLowerCase();
  } catch {
    return null;
  }
}

const allowedHost = hostOf(config.ORIGIN_URL);
// Vercel preview/branch deploys share the production project's prefix, e.g.
//   kimorah-life.vercel.app  →  kimorah-life-git-main-<user>.vercel.app
// so allow any *.vercel.app host that starts with "<project>-" too.
const vercelPreviewPrefix =
  allowedHost && allowedHost.endsWith(".vercel.app") ? `${allowedHost.split(".")[0]}-` : null;

/**
 * Whether a browser Origin is allowed. Compares by HOSTNAME (so a scheme or
 * trailing-slash mismatch in ORIGIN_URL still matches), allows the project's
 * Vercel preview deploys, and allows localhost in development. Exported so the
 * /api/health diagnostics report can show the same verdict.
 */
export function isCorsOriginAllowed(origin?: string): boolean {
  if (!origin) return true; // no Origin header (curl / same-origin / server-to-server)
  const host = hostOf(origin);
  if (!host) return false;
  if (allowedHost && host === allowedHost) return true;
  if (vercelPreviewPrefix && host.endsWith(".vercel.app") && host.startsWith(vercelPreviewPrefix)) return true;
  if (!isProd && (host === "localhost" || host === "127.0.0.1")) return true;
  return false;
}

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (isCorsOriginAllowed(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
