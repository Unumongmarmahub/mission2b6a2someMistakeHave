"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBooking = exports.getBookings = exports.createBooking = void 0;
const bookings_service_1 = require("./bookings.service");
const createBooking = async (req, res) => {
    try {
        const data = await bookings_service_1.bookingsService.create(req.body, req.user);
        return res.status(201).json({ success: true, message: "Booking created successfully", data });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.createBooking = createBooking;
const getBookings = async (req, res) => {
    try {
        const data = await bookings_service_1.bookingsService.getAll(req.user);
        const msg = (req.user.role === "admin") ? "Bookings retrieved successfully" : "Your bookings retrieved successfully";
        return res.status(200).json({ success: true, message: msg, data });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getBookings = getBookings;
const updateBooking = async (req, res) => {
    try {
        const id = Number(req.params.bookingId);
        const data = await bookings_service_1.bookingsService.updateStatus(id, req.body, req.user);
        return res.status(200).json({ success: true, message: data.message, data: data.data });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};
exports.updateBooking = updateBooking;
