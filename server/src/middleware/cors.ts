import cors from "cors";
import config from "../config";

export const corsMiddleware = cors({
  origin: config.ORIGIN_URL as string,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
