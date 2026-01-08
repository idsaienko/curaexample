const mongoose = require("mongoose");

// 🟢 Sub-schema for Elimination
const EliminationSchema = new mongoose.Schema(
  {
    date: String,
    interval: String,
    amount: String,
    consistency: String,
  },
  { _id: true }
);

// 🟢 Sub-schema for Mobility
const MobilitySchema = new mongoose.Schema(
  {
    time: String,
    activity: String,
    details: String,
    support: String,
  },
  { _id: true }
);

// 🟢 Sub-schema for General
const GeneralSchema = new mongoose.Schema(
  {
    title: String,
    description: mongoose.Schema.Types.Mixed, // 🧠 can store object or text
    type: {
      type: String,
      enum: ["info", "plan", "activity"],
      default: "info",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// 🟢 Main Staff Schema
const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: String,
  bedNumber: String,
  careLevel: String,
  photo: String,

  // ✅ String-based logs
  pain: {
    type: [
      {
        level: Number,
        location: String,
        notes: String,
        time: Date,
        date: String
      }
    ],
    default: []
  },
  nutrition: {
    type: [
      {
        mealType: String,
        amount: String,
        notes: String,
        time: Date
      }
    ],
    default: []
  },
  medication: { type: [String], default: [] },
  urination: { type: [String], default: [] },

  // ✅ Object-based logs
  mobility: { type: [MobilitySchema], default: [] },
  elimination: { type: [EliminationSchema], default: [] },
  general: { type: [GeneralSchema], default: [] },
});

// ✅ Export model (CommonJS)
module.exports = mongoose.model("Staff", StaffSchema);
