import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import vehicleRoutes from "./modules/vehicles/vehicles.route";
import userRoutes from "./modules/users/users.route";
import bookingRoutes from "./modules/bookings/bookings.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.use(errorHandler);

export default app;
