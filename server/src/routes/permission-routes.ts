import express from "express";
import {
  getAllPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission-controller";
import { authorize } from "../middleware/authorize";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

// Read — any authenticated user needs this to render the permissions matrix
router.get("/all", authenticate, getAllPermissions);

// Write — restricted to roles managers
router.post("/create", authorize("roles:write"), createPermission);
router.put("/:id", authorize("roles:write"), updatePermission);
router.delete("/:id", authorize("roles:delete"), deletePermission);

export default router;
