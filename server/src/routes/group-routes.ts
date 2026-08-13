import express from "express";
import {
  createGroup,
  deleteGroup,
  getGroupById,
  getGroupHistory,
  getGroups,
  getProfessionals,
  setParticipants,
  updateGroup,
} from "../controllers/group-controller";
import { authorize } from "../middleware/authorize";

const router = express.Router();

// Every route is permission-guarded, but holding the permission is only half of
// it: the controller narrows each call to the groups the caller actually runs,
// so `groups:read` means "my groups" for a professional and "all groups" for a
// global role.
router.get("/", authorize("groups:read"), getGroups);
router.post("/", authorize("groups:add"), createGroup);

// Must stay above "/:id" or Express reads "professionals" as a group id.
router.get("/professionals", authorize("groups:read"), getProfessionals);

router.get("/:id", authorize("groups:read"), getGroupById);
router.get("/:id/history", authorize("groups:read"), getGroupHistory);

router.put("/:id", authorize("groups:write"), updateGroup);
// Recording attendance is an edit, not a management action — a co-professional
// may do it, which the controller enforces.
router.patch("/:id/sessions/:sessionId", authorize("groups:write"), setParticipants);

router.delete("/:id", authorize("groups:delete"), deleteGroup);

export default router;
