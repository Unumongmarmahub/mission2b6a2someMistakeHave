import { db } from "../../config/db";

const daysBetween = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000*60*60*24));
  return diff;
};

export const bookingsService = {
  create: async (payload: any, requester: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const cid = requester.role === "customer" ? requester.id : customer_id;
    if (!cid || !vehicle_id || !rent_start_date || !rent_end_date) throw new Error("All fields required");
    
    const vq = `SELECT id,daily_rent_price,availability_status,vehicle_name FROM vehicles WHERE id = $1`;
    const vr = await db.query(vq, [vehicle_id]);
    if (vr.rows.length === 0) throw new Error("Vehicle not found");
    const vehicle = vr.rows[0];
    if (vehicle.availability_status !== "available") throw new Error("Vehicle not available");
    const numDays = daysBetween(rent_start_date, rent_end_date);
    if (numDays <= 0) throw new Error("rent_end_date must be after start date");
    const total = Number(vehicle.daily_rent_price) * numDays;
    const iq = `INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
      VALUES ($1,$2,$3,$4,$5,'active') RETURNING id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status`;
    const ir = await db.query(iq, [cid, vehicle_id, rent_start_date, rent_end_date, total]);
   
    await db.query(`UPDATE vehicles SET availability_status='booked' WHERE id = $1`, [vehicle_id]);
    const created = ir.rows[0];
    created.vehicle = { vehicle_name: vehicle.vehicle_name, daily_rent_price: vehicle.daily_rent_price };
    return created;
  },

  getAll: async (requester: any) => {
    if (requester.role === "admin") {
      const q = `SELECT b.*, u.name as customer_name, v.vehicle_name, v.registration_number FROM bookings b
        JOIN users u ON u.id = b.customer_id
        JOIN vehicles v ON v.id = b.vehicle_id
        ORDER BY b.id DESC`;
      const r = await db.query(q);
      return r.rows;
    } else {
      const q = `SELECT b.*, v.vehicle_name, v.registration_number, v.type FROM bookings b
        JOIN vehicles v ON v.id = b.vehicle_id
        WHERE b.customer_id = $1 ORDER BY b.id DESC`;
      const r = await db.query(q, [requester.id]);
      return r.rows;
    }
  },

  updateStatus: async (id: number, payload: any, requester: any) => {
    const q = `SELECT * FROM bookings WHERE id = $1`;
    const r = await db.query(q, [id]);
    if (r.rows.length === 0) throw new Error("Booking not found");
    const booking = r.rows[0];
    const status = payload.status;
    if (!status) throw new Error("status required");

    if (status === "cancelled") {
      
      if (requester.role === "customer" && requester.id !== booking.customer_id) throw new Error("Forbidden");
      const today = new Date().toISOString().slice(0,10);
      if (today >= booking.rent_start_date) throw new Error("Cannot cancel on or after start date");
      await db.query(`UPDATE bookings SET status='cancelled' WHERE id = $1`, [id]);
      await db.query(`UPDATE vehicles SET availability_status='available' WHERE id = $1`, [booking.vehicle_id]);
      const updated = {...booking, status: 'cancelled'};
      return { message: "Booking cancelled successfully", data: updated };
    }

    if (status === "returned") {
      
      if (requester.role !== "admin") throw new Error("Forbidden");
      await db.query(`UPDATE bookings SET status='returned' WHERE id = $1`, [id]);
      await db.query(`UPDATE vehicles SET availability_status='available' WHERE id = $1`, [booking.vehicle_id]);
      const updated = {...booking, status: 'returned', vehicle: { availability_status: 'available' }};
      return { message: "Booking marked as returned. Vehicle is now available", data: updated };
    }

    throw new Error("Invalid status");
  }
};
