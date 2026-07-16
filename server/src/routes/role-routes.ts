import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../controllers/role-controller";
import { authorize } from "../middleware/authorize";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

// Read routes — any authenticated user needs roles to resolve their own permissions
router.get("/all", authenticate, getAllRoles);
router.get("/:id", authenticate, getRoleById);

// Write routes — restricted
router.post("/create", authorize("roles:write"), createRole);
router.put("/:id", authorize("roles:write"), updateRole);
router.delete("/:id", authorize("roles:delete"), deleteRole);

export default router;
