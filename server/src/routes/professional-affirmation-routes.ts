import { Router } from "express";
import { getRandomProfessionalAffirmation } from "../controllers/professional-affirmation-controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();
router.get("/random", authenticate, getRandomProfessionalAffirmation);
export default router;
