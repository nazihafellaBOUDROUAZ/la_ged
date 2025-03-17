// routes/employees.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// 🔹 GET all employees (❗Exclude password)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, department, email FROM employees");
    res.json(rows);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// 🔹 POST add employee (Check for unique name + hash password)
router.post("/", async (req, res) => {
  const { name, department, email, password } = req.body;

  if (!name || !department || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if employee with same name exists
    const [existing] = await db.query("SELECT * FROM employees WHERE name = ?", [name]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An employee with this name already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert employee
    await db.query(
      "INSERT INTO employees (name, department, email, password) VALUES (?, ?, ?, ?)",
      [name, department, email, hashedPassword]
    );

    res.json({ message: "Employee added successfully" });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// 🔹 DELETE employee
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM employees WHERE id = ?", [id]);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

// 🔹 PUT edit employee (optional password update)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, department, email, password } = req.body;

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "UPDATE employees SET name = ?, department = ?, email = ?, password = ? WHERE id = ?",
        [name, department, email, hashedPassword, id]
      );
    } else {
      await db.query(
        "UPDATE employees SET name = ?, department = ?, email = ? WHERE id = ?",
        [name, department, email, id]
      );
    }

    res.json({ message: "Employee updated" });
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ message: "Error updating employee" });
  }
});

module.exports = router;
