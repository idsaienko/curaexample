require("dotenv").config();

const mongoose = require("mongoose");
const Staff = require("../models/Staff");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected. Running migration…");

  const residents = await Staff.find();

  for (const r of residents) {
    // Migrate nutrition if old format was strings
    if (Array.isArray(r.nutrition) && typeof r.nutrition[0] === "string") {
      r.nutrition = r.nutrition.map((text) => ({
        mealType: "unspecified",
        amount: "unspecified",
        notes: text,
        time: new Date(),
      }));
    }

    // Migrate pain if old format was strings
    if (Array.isArray(r.pain) && typeof r.pain[0] === "string") {
      r.pain = r.pain.map((text) => ({
        level: 0,
        location: "unspecified",
        notes: text,
        time: new Date(),
        date: new Date().toISOString().slice(0, 10),
      }));
    }

    await r.save();
  }

  console.log("Migration completed.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
