const Resident = require("../models/Staff.js");
const mongoose = require("mongoose");
const { extractReportData } = require("../services/llmServices");

function timeStringToDate(timeStr) {
  // timeStr like "08:00" or "12:30"
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

/**
 * POST /api/llm/analyze
 */
const analyzeNoteWithLLM = async (req, res) => {
  const { note, residentId } = req.body;

  if (!note || !residentId) {
    return res.status(400).json({
      success: false,
      message: "note and residentId are required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(residentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid residentId",
    });
  }

  try {
    // 1️⃣ Ensure resident exists
    const resident = await Resident.findById(residentId);
    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    // 2️⃣ Call LLM via service (OpenAI logic lives there now)
    const parsed = await extractReportData(note);
    console.log("🔍 LLM parsed result:", JSON.stringify(parsed, null, 2));

    if (
      !parsed ||
      !parsed.mealSchedules ||
      !parsed.movements ||
      !parsed.ausscheidungen
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid LLM structure",
      });
    }

    // 3️⃣ Save entries
    const now = new Date();

    // 🍽️ meal schedules → nutrition
    for (const m of parsed.mealSchedules) {
      resident.nutrition.push({
        mealType: m.mealType || m.meal || "—",
        amount: m.amount || m.quantity || "—",
        notes: m.details || m.notes || "Normales Gericht",
        time: m.time ? timeStringToDate(m.time) : new Date(),
      });
    }

    // 🏃 movements → mobility
    for (const mv of parsed.movements) {
      resident.mobility.push({
        ...mv,
        time: mv.time ? timeStringToDate(mv.time) : new Date(),
      });
    }

    // 🚽 ausscheidungen → elimination
    for (const ex of parsed.ausscheidungen) {
      resident.elimination.push({
        ...ex,
        time: ex.time,
      });
    }

    await resident.save();

    // 4️⃣ Respond to frontend
    res.json({
      success: true,
      savedCategories: [
        parsed.mealSchedules.length > 0 ? "nutrition" : null,
        parsed.movements.length > 0 ? "mobility" : null,
        parsed.ausscheidungen.length > 0 ? "elimination" : null,
      ].filter(Boolean),
      message: "Einträge erfolgreich gespeichert",
    });
  } catch (err) {
    console.error("❌ LLM controller error:", err);
    res.status(500).json({
      success: false,
      message: "LLM processing failed",
    });
  }
};

module.exports = {analyzeNoteWithLLM};
