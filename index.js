// server.js
require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const llmRoutes = require("./routes/llmRoutes.js")
const staffRoutes = require("./routes/staffRoutes.js");
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://curalink.care", // Deployed frontend
      "http://curafront.up.railway.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Base route
app.get("/", (req, res) => res.send("✅ API is running..."));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/llm", llmRoutes);

// ✅ Listen locally
if (!PORT) {
  console.error("PORT not provided by Railway");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing HTTP server and database connections...");

  try {
    // Stop accepting new requests
    server.close(() => {
      console.log("HTTP server closed");
    });

    // If you use mongoose:
    if (mongoose && mongoose.connection) {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown", err);
    process.exit(1);
  }
});

// ✅ Export for Vercel
module.exports = app;
