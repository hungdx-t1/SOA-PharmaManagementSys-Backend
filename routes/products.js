import express from "express";
import { db } from "../db.js";
import { verifyToken } from "./authMiddleware.js";
const router = express.Router();

// GET all
router.get("/", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id"
  );
  res.json(rows);
});

// ADD
router.post("/", verifyToken, async (req, res) => {
  const { name, category_id, price, quantity, unit, manufacturer, expiry_date } = req.body;
  await db.query(
    "INSERT INTO products (name, category_id, price, quantity, unit, manufacturer, expiry_date) VALUES (?,?,?,?,?,?,?)",
    [name, category_id, price, quantity, unit, manufacturer, expiry_date]
  );
  res.json({ message: "Product added" });
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  const { name, category_id, price, quantity, expiry_date } = req.body;
  await db.query(
    "UPDATE products SET name=?, category_id=?, price=?, quantity=?, expiry_date=? WHERE id=?",
    [name, category_id, price, quantity, expiry_date, req.params.id]
  );
  res.json({ message: "Product updated" });
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
});

export default router;
