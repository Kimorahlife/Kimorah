import dotenv from "dotenv";
import path from "path";

// Load .env.development.local in dev, .env in production
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env"
    : ".env.development.local";

dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001"),
  MONGO_URI: process.env.MONGO_URI,
  ORIGIN_URL: process.env.ORIGIN_URL,
};

export default config;
