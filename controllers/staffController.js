const Staff = require("../models/Staff.js");
const multer = require("multer");

// 🗂️ Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("photo");

// 🟢 GET all residents
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (err) {
    console.error("❌ Error fetching staff:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 GET single resident
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ error: "Resident not found" });
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 POST - Create new resident
const createStaff = async (req, res) => {
  try {
    const {
      name,
      room,
      bedNumber,
      careLevel,
      pain,
      nutrition,
      mobility,
      elimination,
      medication,
      urination,
      general,
    } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    let photo = null;
    if (req.file) {
      photo = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const staff = await Staff.create({
      name,
      room,
      bedNumber,
      careLevel,
      pain: pain ? [pain] : [],
      nutrition: nutrition ? [nutrition] : [],
      mobility: mobility ? [mobility] : [],
      elimination: elimination ? [elimination] : [],
      medication: medication ? [medication] : [],
      urination: urination ? [urination] : [],
      general: general ? [general] : [],
      photo,
    });

    res.status(201).json({ message: "Resident created successfully ✅", staff });
  } catch (err) {
    console.error("❌ Error creating resident:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 PUT - Update resident info
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStaff) return res.status(404).json({ error: "Resident not found" });

    res.json({ message: "Resident updated successfully 🎯", staff: updatedStaff });
  } catch (err) {
    console.error("❌ Error updating resident:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 PUT - Add new entry to any category
const updateStaffCategory = async (req, res) => {
  const { id, categoryName } = req.params;
  const { entry, notes } = req.body;
  console.log("Incoming nutrition payload:", req.body);

  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ error: "Resident not found" });

    const validCategories = [
      "pain",
      "nutrition",
      "mobility",
      "elimination",
      "medication",
      "urination",
      "general",
    ];

    if (!validCategories.includes(categoryName)) {
      return res.status(400).json({ error: "Invalid category name" });
    }

    if (["mobility", "elimination", "general"].includes(categoryName)) {
      if (!entry || typeof entry !== "object") {
        return res.status(400).json({ error: `Invalid ${categoryName} entry` });
      }
      staff[categoryName].push(entry);
    } else if (categoryName === "nutrition") {
      if (!notes || typeof notes !== "object") {
        return res.status(400).json({ error: "Invalid nutrition entry" });
      }

      // Expecting notes = { mealType, amount, notes, time }
      staff.nutrition.push({
        mealType: notes.mealType || "—",
        amount: notes.amount || "—",
        notes: notes.notes || "—",
        time: notes.time || new Date().toISOString(),
      });
    } else {
      staff[categoryName].push(notes || "—");
    }

    await staff.save();
    res.json({ message: "Entry added successfully ✅", staff });
  } catch (err) {
    console.error("❌ Error updating category:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔴 DELETE elimination entry
const deleteEliminationEntry = async (req, res) => {
  const { id, entryId } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ error: "Resident not found" });
    staff.elimination = staff.elimination.filter(
      (item) => item._id.toString() !== entryId
    );
    await staff.save();
    res.json({ message: "Elimination entry deleted 🗑️", staff });
  } catch (err) {
    console.error("❌ Error deleting elimination entry:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔴 DELETE mobility entry
const deleteMobilityEntry = async (req, res) => {
  const { id, entryId } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ error: "Resident not found" });
    staff.mobility = staff.mobility.filter(
      (item) => item._id.toString() !== entryId
    );
    await staff.save();
    res.json({ message: "Mobility entry deleted 🗑️", staff });
  } catch (err) {
    console.error("❌ Error deleting mobility entry:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔴 DELETE general entry
const deleteGeneralEntry = async (req, res) => {
  const { id, entryId } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ error: "Resident not found" });
    staff.general = staff.general.filter(
      (item) => item._id.toString() !== entryId
    );
    await staff.save();
    res.json({ message: "General entry deleted 🗑️", staff });
  } catch (err) {
    console.error("❌ Error deleting general entry:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔴 DELETE - Resident
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Resident not found" });
    res.json({ message: "Resident deleted successfully 🗑️" });
  } catch (err) {
    console.error("❌ Error deleting resident:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Export all controllers (CommonJS)
module.exports = {
  upload,
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  updateStaffCategory,
  deleteEliminationEntry,
  deleteMobilityEntry,
  deleteGeneralEntry,
  deleteStaff,
};
