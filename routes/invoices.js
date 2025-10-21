import express from "express";
import { db } from "../db.js";
import { verifyToken } from "./authMiddleware.js";
const router = express.Router();

// GET all invoices
router.get("/", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT i.*, u.username FROM invoices i LEFT JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC"
  );
  res.json(rows);
});

// CREATE invoice
router.post("/", verifyToken, async (req, res) => {
  const { items, customer_name } = req.body;
  let total = 0;
  items.forEach(i => (total += i.price * i.quantity));

  const [result] = await db.query(
    "INSERT INTO invoices (user_id, customer_name, total_amount) VALUES (?, ?, ?)",
    [req.user.id, customer_name, total]
  );

  const invoiceId = result.insertId;

  for (const item of items) {
    await db.query(
      "INSERT INTO invoice_items (invoice_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)",
      [invoiceId, item.product_id, item.quantity, item.price, item.price * item.quantity]
    );
    await db.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [
      item.quantity,
      item.product_id
    ]);
  }

  res.json({ message: "Invoice created", invoice_id: invoiceId, total });
});

export default router;
