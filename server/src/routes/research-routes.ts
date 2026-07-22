import express from "express";
import { submitResponse, getAggregates, getSurvey } from "../controllers/research-controller";

const router = express.Router();

// Public — the survey and dashboard are open to visitors.
router.get("/coqui/survey", getSurvey);
router.post("/coqui/response", submitResponse);
router.get("/coqui/aggregates", getAggregates);

export default router;
