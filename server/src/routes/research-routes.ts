import express from "express";
import { submitResponse, getAggregates } from "../controllers/research-controller";

const router = express.Router();

// Public — the survey and dashboard are open to visitors.
router.post("/coqui/response", submitResponse);
router.get("/coqui/aggregates", getAggregates);

export default router;
