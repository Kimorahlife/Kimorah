import express from "express";
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

// Initialize Express
const app = express();
app.use(corsMiddleware);
app.use(bodyParser.json({ limit: "10mb" }));

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);

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
