import { Router } from "express";
import * as ctrl from "./bookings.controller";
import { protect, permit } from "../../middlewares/auth";

const router = Router();

router.post("/", protect, permit("admin","customer"), ctrl.createBooking);
router.get("/", protect, ctrl.getBookings);
router.put("/:bookingId", protect, ctrl.updateBooking);

export default router;
