import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";

export const authService = {
  handleSignup: async (payload: any) => {
    const { name, email, password, phone, role } = payload;
    if (!name || !email || !password || !phone || !role) {
      throw new Error("All fields are required");
    }
    const hashed = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`;
    const values = [name, email.toLowerCase(), hashed, phone, role];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  handleSignin: async (payload: any) => {
    const { email, password } = payload;
    if (!email || !password) throw new Error("Email and password required");
    const q = `SELECT * FROM users WHERE email = $1`;
    const r = await db.query(q, [email.toLowerCase()]);
    if (r.rows.length === 0) throw new Error("User not found");
    const user = r.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  },
};
