import express from "express";
import { translateTexts } from "../controllers/translation-controller";
import { authorize } from "../middleware/authorize";

const router = express.Router();

// Gated on `curriculum-builder:write` rather than plain authentication: every call
// costs money, so it is limited to the people who can already author the copy
// being translated.
router.post("/", authorize("curriculum-builder:write"), translateTexts);

export default router;
