const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const dataDir = path.join(__dirname, "data");
const productsFile = path.join(dataDir, "products.json");
const ordersFile = path.join(dataDir, "orders.json");
const usersFile = path.join(dataDir, "users.json");

// Utility function untuk baca dan tulis JSON
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===================== API =====================

// Produk
app.get("/api/products", (req, res) => {
  res.json(readJSON(productsFile));
});

app.post("/api/products", (req, res) => {
  const products = readJSON(productsFile);
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeJSON(productsFile, products);
  res.json(newProduct);
});

// Orders
app.get("/api/orders", (req, res) => {
  res.json(readJSON(ordersFile));
});

app.post("/api/orders", (req, res) => {
  const orders = readJSON(ordersFile);
  const newOrder = { id: Date.now(), status: "pending", ...req.body };
  orders.push(newOrder);
  writeJSON(ordersFile, orders);
  res.json(newOrder);
});

app.patch("/api/orders/:id", (req, res) => {
  const orders = readJSON(ordersFile);
  const order = orders.find(o => o.id == req.params.id);
  if (order) {
    Object.assign(order, req.body);
    writeJSON(ordersFile, orders);
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

// Users
app.get("/api/users", (req, res) => {
  res.json(readJSON(usersFile));
});

app.post("/api/users", (req, res) => {
  const users = readJSON(usersFile);
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  writeJSON(usersFile, users);
  res.json(newUser);
});

// ===================== Start Server =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
