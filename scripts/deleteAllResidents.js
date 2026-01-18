require("dotenv").config();
const mongoose = require("mongoose");
const Staff = require("../models/Staff");

async function deleteAllResidents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Staff.deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} residents`);
  } catch (err) {
    console.error("❌ Failed to delete residents:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

deleteAllResidents();
