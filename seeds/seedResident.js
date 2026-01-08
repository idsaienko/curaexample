require("dotenv").config();

const mongoose = require("mongoose");
const Staff = require("../models/Staff");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await Staff.create({
    name: "Max Mustermann",
    room: "101",
    bedNumber: "1",
    careLevel: "3",
  });

  console.log("Seed complete");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
