require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: "GET, POST, PUT, DELETE",
  credentials: true
}));

// Serve static images
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

// Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
