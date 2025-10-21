import express from "express";
import { db } from "../db.js";
import { verifyToken, isAdmin } from "./authMiddleware.js";
const router = express.Router();

router.get("/", verifyToken, isAdmin, async (req, res) => {
  const [rows] = await db.query("SELECT id, username, role, created_at FROM users");
  res.json(rows);
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ message: "User deleted" });
});

export default router;
