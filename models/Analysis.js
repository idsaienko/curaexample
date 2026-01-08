const mongoose = require ("mongoose");

const AnalysisSchema = new mongoose.Schema({
  rawText: String,

  mealSchedules: [
    {
      mealType: String,
      mealTime: Date,
      comments: String,
      mealName: String
    }
  ],

  movements: [
    {
      room: String,
      object: String,
      angle: Number,
      movementTime: Date,
      notes: String,
      staffId: Number
    }
  ],

  ausscheidungen: [
    {
      abstand: String,
      menge: String,
      konsistenz: String,
      time: Date,
      staffId: Number
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Analysis", AnalysisSchema);
