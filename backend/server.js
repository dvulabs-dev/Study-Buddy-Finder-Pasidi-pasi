require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running successfully 🚀",
  });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
