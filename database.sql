CREATE DATABASE pharmacy_db;
USE pharmacy_db;

-- Quản lý người dùng (User Service)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('admin','staff') DEFAULT 'staff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Loại thuốc (Product Category)
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Thông tin thuốc (Product Service)
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'hộp', -- ví dụ: viên, hộp, lọ
  manufacturer VARCHAR(100),       -- nhà sản xuất
  expiry_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Quản lý hóa đơn (Invoice Service)
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,                       -- người lập hóa đơn
  customer_name VARCHAR(100),        -- tên khách hàng (tùy chọn)
  total_amount DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Chi tiết hóa đơn (Invoice Items)
CREATE TABLE invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Quản lý nhập hàng - Inventory Service mở rộng
CREATE TABLE stock_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  supplier_name VARCHAR(100),
  quantity INT,
  purchase_price DECIMAL(10,2),
  entry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- (Dành cho Report Service) – bảng log đơn giản để lưu tổng kết hàng ngày
CREATE TABLE daily_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_date DATE,
  total_sales DECIMAL(12,2),
  total_invoices INT,
  total_products_sold INT
);