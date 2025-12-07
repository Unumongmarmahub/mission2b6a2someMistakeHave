import { Router } from "express";
import * as ctrl from "./users.controller";
import { protect, permit } from "../../middlewares/auth";

const router = Router();

router.get("/", protect, permit("admin"), ctrl.getAllUsers);
router.put("/:userId", protect, ctrl.updateUser);
router.delete("/:userId", protect, permit("admin"), ctrl.deleteUser);

export default router;
