const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ MongoDB already connected");
      return;
    }

    const MONGO_URI = process.env.MONGO_URI;
    const conn = await mongoose.connect(MONGO_URI, {});

    console.log(`✅ MongoDB Connected: ${conn.connection.host} 🚀`);
  } catch (err) {
    console.error(`❌ DB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
