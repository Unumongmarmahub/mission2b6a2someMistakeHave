"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
exports.authService = {
    handleSignup: async (payload) => {
        const { name, email, password, phone, role } = payload;
        if (!name || !email || !password || !phone || !role) {
            throw new Error("All fields are required");
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const query = `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`;
        const values = [name, email.toLowerCase(), hashed, phone, role];
        const result = await db_1.db.query(query, values);
        return result.rows[0];
    },
    handleSignin: async (payload) => {
        const { email, password } = payload;
        if (!email || !password)
            throw new Error("Email and password required");
        const q = `SELECT * FROM users WHERE email = $1`;
        const r = await db_1.db.query(q, [email.toLowerCase()]);
        if (r.rows.length === 0)
            throw new Error("User not found");
        const user = r.rows[0];
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } };
    }
};
