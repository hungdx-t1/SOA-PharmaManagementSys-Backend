import express from "express";
import { db } from "../db.js";
import { verifyToken } from "./authMiddleware.js";
const router = express.Router();

// Báo cáo doanh thu theo ngày
router.get("/sales", verifyToken, async (req, res) => {
  const [rows] = await db.query(`
    SELECT DATE(created_at) AS date, SUM(total_amount) AS total_sales, COUNT(*) AS total_invoices
    FROM invoices GROUP BY DATE(created_at)
  `);
  res.json(rows);
});

// Báo cáo tồn kho
router.get("/inventory", verifyToken, async (req, res) => {
  const [rows] = await db.query(
    "SELECT name, quantity, expiry_date FROM products ORDER BY quantity ASC"
  );
  res.json(rows);
});

export default router;
