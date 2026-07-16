import express from "express";
import {
  loginUser,
  signupUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/users-controller";
import { authorize } from "../middleware/authorize";

const router = express.Router();

router.post("/login", loginUser);   // public
router.post("/signup", signupUser); // public

router.get("/all", authorize("users:read"), getAllUsers);
router.get("/:pid", authorize("users:read"), getUserById);
router.put("/:id", authorize("users:write"), updateUser);
router.delete("/:id", authorize("users:delete"), deleteUser);

export default router;
