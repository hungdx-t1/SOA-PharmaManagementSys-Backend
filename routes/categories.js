import express from "express";
import { db } from "../db.js";
import { verifyToken, isAdmin } from "./authMiddleware.js";

const router = express.Router();

// 🧾 Lấy danh sách tất cả danh mục thuốc
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục" });
  }
});

// ➕ Thêm danh mục mới (chỉ admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Thiếu tên danh mục" });

    await db.query("INSERT INTO categories (name, description) VALUES (?, ?)", [
      name,
      description || null,
    ]);
    res.json({ message: "Đã thêm danh mục mới" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm danh mục" });
  }
});

// ✏️ Cập nhật danh mục (chỉ admin)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.query("UPDATE categories SET name = ?, description = ? WHERE id = ?", [
      name,
      description || null,
      req.params.id,
    ]);
    res.json({ message: "Cập nhật danh mục thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật danh mục" });
  }
});

// 🗑️ Xóa danh mục (chỉ admin)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
    res.json({ message: "Đã xóa danh mục" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa danh mục" });
  }
});

export default router;
