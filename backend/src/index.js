const express = require("express");
const authenticate = require("./middleware/auth.middleware");
const authorize = require("./middleware/authz.middleware");

const app = express();

// Define a port
const PORT = process.env.PORT || 5000;

// Sample route (Public)
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Protected route (Admin only)
app.get("/admin-dashboard", authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
