import { Router } from "express";
import * as controller from "./vehicles.controller";
import { protect, permit } from "../../middlewares/auth";

const router = Router();

router.post("/", protect, permit("admin"), controller.createVehicle);
router.get("/", controller.getAllVehicles);
router.get("/:vehicleId", controller.getVehicleById);
router.put("/:vehicleId", protect, permit("admin"), controller.updateVehicle);
router.delete("/:vehicleId", protect, permit("admin"), controller.deleteVehicle);

export default router;
