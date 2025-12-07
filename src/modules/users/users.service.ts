import { db } from "../../config/db";
import bcrypt from "bcrypt";

export const usersService = {
  getAll: async () => {
    const q = `SELECT id,name,email,phone,role FROM users ORDER BY id DESC`;
    const r = await db.query(q);
    return r.rows;
  },

  update: async (id: number, payload: any, requester: any) => {
    // if not admin, can only update own profile and not role
    if (requester.role !== "admin" && requester.id !== id) throw new Error("Forbidden");
    const allowed = ["name","email","phone","role","password"];
    const sets: string[] = [];
    const vals: any[] = [];
    let idx = 1;
    for (const key of allowed) {
      if (payload[key] !== undefined) {
        if (key === "password") {
          const hashed = await bcrypt.hash(payload.password, 10);
          sets.push(`password = $${idx}`);
          vals.push(hashed);
        } else {
          if (key === "role" && requester.role !== "admin") continue;
          sets.push(`${key} = $${idx}`);
          vals.push(payload[key]);
        }
        idx++;
      }
    }
    if (sets.length === 0) throw new Error("No fields to update");
    vals.push(id);
    const q = `UPDATE users SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id,name,email,phone,role`;
    const r = await db.query(q, vals);
    return r.rows[0];
  },

  remove: async (id: number) => {
    const q1 = `SELECT count(*) as cnt FROM bookings WHERE customer_id = $1 AND status = 'active'`;
    const r1 = await db.query(q1, [id]);
    if (Number(r1.rows[0].cnt) > 0) throw new Error("Cannot delete user with active bookings");
    await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    return;
  }
};
