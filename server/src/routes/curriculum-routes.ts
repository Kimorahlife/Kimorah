import express from "express";
import {
  createCurriculum,
  deleteCurriculum,
  getAllCurriculums,
  getCurriculumById,
  getCurriculumHistory,
  getCurriculumUsage,
  getPublicCurriculumBySlug,
  getPublicCurriculums,
  setCurriculumArchived,
  updateCurriculum,
} from "../controllers/curriculum-controller";
import { authorize } from "../middleware/authorize";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

// Reads — any signed-in user. Browsing curricula is gated on the `curriculums`
// feature client-side; these stay open to authenticated callers so a future
// reader (e.g. the public pages) needs no new route.
//
// Authoring is a separate permission. `curriculums` means "may look at the
// curricula"; `curriculum-builder` means "may write them". They used to be the
// same key, so granting a professional the reading list also handed them the
// power to rewrite and delete every curriculum in it.
// The public Mission page has no token. Published curricula only, and this must
// stay above "/:id" or Express reads "public" as an id.
router.get("/public", getPublicCurriculums);
router.get("/public/:slug", getPublicCurriculumBySlug);

router.get("/all", authenticate, getAllCurriculums);
router.get("/:id", authenticate, getCurriculumById);

// Which groups depend on this curriculum. Read by the delete dialog and by the
// builder before it lets an author drop a session someone has recorded against —
// both are builder surfaces, so they follow the builder permission.
router.get("/:id/usage", authorize("curriculum-builder:read"), getCurriculumUsage);
router.get("/:id/history", authorize("curriculum-builder:read"), getCurriculumHistory);

// Writes — each guarded by its own action, so a role granted only Add cannot edit
// or delete. Matches the split in role-routes.ts.
router.post("/create", authorize("curriculum-builder:add"), createCurriculum);
router.put("/:id", authorize("curriculum-builder:write"), updateCurriculum);
// Archiving is an edit, not a deletion — it is the way out when a curriculum
// is in use and cannot be deleted, so it must not need the delete permission.
router.patch("/:id/archive", authorize("curriculum-builder:write"), setCurriculumArchived);
router.delete("/:id", authorize("curriculum-builder:delete"), deleteCurriculum);

export default router;
