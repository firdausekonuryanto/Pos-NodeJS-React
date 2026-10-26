const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect directly to Laragon's MySQL database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Default Laragon MySQL password is blank
  database: "node_crud_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// READ: Get all items from MySQL database
app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE: Save a new item into MySQL database
app.post("/api/items", async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO items (name, price) VALUES (?, ?)",
      [name, price],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      price: Number(price),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Edit an item in MySQL database
app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const [result] = await pool.query(
      "UPDATE items SET name = ?, price = ? WHERE id = ?",
      [name, price, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ id: parseInt(id), name, price: Number(price) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove an item from MySQL database
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Backend server running on port ${PORT} and connected to MySQL!`),
);
