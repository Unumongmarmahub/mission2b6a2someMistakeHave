import { db } from "../config/db";

export const createTables = async () => {
  const query = `
  -- Users Table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin','customer')),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Vehicles Table
  CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name TEXT NOT NULL,
    type TEXT NOT NULL,
    registration_number TEXT NOT NULL UNIQUE,
    daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
    availability_status TEXT NOT NULL CHECK (availability_status IN ('available','booked')),
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Bookings Table
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active','cancelled','returned')),
    created_at TIMESTAMP DEFAULT NOW()
  );
  `;

  try {
    await db.query(query);
    console.log("All tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
