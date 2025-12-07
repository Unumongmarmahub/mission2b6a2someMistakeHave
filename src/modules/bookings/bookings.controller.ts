import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const data = await bookingsService.create(req.body, (req as any).user);
    return res.status(201).json({ success: true, message: "Booking created successfully", data });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const data = await bookingsService.getAll((req as any).user);
    const msg = ((req as any).user.role === "admin") ? "Bookings retrieved successfully" : "Your bookings retrieved successfully";
    return res.status(200).json({ success: true, message: msg, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.bookingId);
    const data = await bookingsService.updateStatus(id, req.body, (req as any).user);
    return res.status(200).json({ success: true, message: data.message, data: data.data });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
