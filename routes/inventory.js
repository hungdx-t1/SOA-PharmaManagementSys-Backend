import express from "express";
import { db } from "../db.js";
import { verifyToken, isAdmin } from "./authMiddleware.js";
const router = express.Router();

// Nhập hàng (stock entry)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  const { product_id, supplier_name, quantity, purchase_price } = req.body;
  await db.query(
    "INSERT INTO stock_entries (product_id, supplier_name, quantity, purchase_price) VALUES (?, ?, ?, ?)",
    [product_id, supplier_name, quantity, purchase_price]
  );
  await db.query("UPDATE products SET quantity = quantity + ? WHERE id = ?", [
    quantity,
    product_id
  ]);
  res.json({ message: "Stock updated" });
});

// Kiểm tra thuốc sắp hết
router.get("/low-stock", verifyToken, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products WHERE quantity < 10");
  res.json(rows);
});

export default router;
