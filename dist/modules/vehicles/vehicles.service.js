"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesService = void 0;
const db_1 = require("../../config/db");
exports.vehiclesService = {
    create: async (payload) => {
        const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
        if (!vehicle_name || !type || !registration_number || !daily_rent_price || !availability_status) {
            throw new Error("All fields are required");
        }
        const q = `INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status)
      VALUES ($1,$2,$3,$4,$5) RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status`;
        const vals = [vehicle_name, type, registration_number, daily_rent_price, availability_status];
        const r = await db_1.db.query(q, vals);
        return r.rows[0];
    },
    getAll: async () => {
        const q = `SELECT id,vehicle_name,type,registration_number,daily_rent_price,availability_status FROM vehicles ORDER BY id DESC`;
        const r = await db_1.db.query(q);
        return r.rows;
    },
    getById: async (id) => {
        const q = `SELECT id,vehicle_name,type,registration_number,daily_rent_price,availability_status FROM vehicles WHERE id = $1`;
        const r = await db_1.db.query(q, [id]);
        return r.rows[0];
    },
    update: async (id, payload) => {
        // simple partial update
        const allowed = ["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"];
        const sets = [];
        const vals = [];
        let idx = 1;
        for (const key of allowed) {
            if (payload[key] !== undefined) {
                sets.push(`${key} = $${idx}`);
                vals.push(payload[key]);
                idx++;
            }
        }
        if (sets.length === 0)
            throw new Error("No fields to update");
        vals.push(id);
        const q = `UPDATE vehicles SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status`;
        const r = await db_1.db.query(q, vals);
        return r.rows[0];
    },
    remove: async (id) => {
        // check active bookings
        const q1 = `SELECT count(*) as cnt FROM bookings WHERE vehicle_id = $1 AND status = 'active'`;
        const r1 = await db_1.db.query(q1, [id]);
        if (Number(r1.rows[0].cnt) > 0)
            throw new Error("Cannot delete vehicle with active bookings");
        await db_1.db.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
        return;
    }
};
