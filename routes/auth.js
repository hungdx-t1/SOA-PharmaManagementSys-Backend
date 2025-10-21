// JWT
import express from "express";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const router = express.Router();

// Đăng ký user mới (chỉ để test)
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [
    username,
    hash,
    role || "staff"
  ]);
  res.json({ message: "User registered successfully" });
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) return res.status(400).json({ message: "User not found" });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ message: "Login successful", token });
});

export default router;
