import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { corsMiddleware } from "./middleware/cors";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import config from "./config";
import { connectDB } from "./database/connection";
import { boot } from "./startup/boot";
import healthRoutes from "./routes/health-routes";
import userRoutes from "./routes/user-routes";
import roleRoutes from "./routes/role-routes";
import permissionRoutes from "./routes/permission-routes";
import researchRoutes from "./routes/research-routes";
import curriculumRoutes from "./routes/curriculum-routes";
import groupRoutes from "./routes/group-routes";
import translationRoutes from "./routes/translation-routes";

/**
 * Warn loudly at boot if required configuration is missing, so a bad deploy is
 * obvious in the logs instead of failing mysteriously at request time.
 */
function validateEnv(): void {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`⚠️  Missing required env var(s): ${missing.join(", ")} — the server will not work correctly.`);
  }
  if (config.env === "production" && !process.env.ORIGIN_URL) {
    console.warn("⚠️  ORIGIN_URL is not set — the deployed client's browser requests will be BLOCKED by CORS.");
  }
  console.log(
    `🔧 Env: NODE_ENV=${config.env} · MONGO_URI=${process.env.MONGO_URI ? "set" : "MISSING"} · ` +
      `JWT_SECRET=${process.env.JWT_SECRET ? "set" : "MISSING"} · ORIGIN_URL=${process.env.ORIGIN_URL || "MISSING"}`,
  );
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("⚠️  ANTHROPIC_API_KEY is not set — curriculum auto-translation will return 503.");
  }
}

validateEnv();

// Initialize Express
const app = express();

// Health check is always CORS-open (reflects any origin) so a browser on ANY
// origin can read the diagnostics report — even one the main CORS policy would
// block. Mounted BEFORE the global CORS so nothing rejects it first.
app.use("/api/health", cors({ origin: true }), healthRoutes);

app.use(corsMiddleware);
app.use(bodyParser.json({ limit: "10mb" }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/curriculums", curriculumRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/translate", translationRoutes);

// 404 + global error handler
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

connectDB()
  .then(async () => {
    await boot();
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
