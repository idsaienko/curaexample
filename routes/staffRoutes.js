const express = require("express");
const{
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  updateStaffCategory,
  deleteEliminationEntry,
  deleteMobilityEntry,
  deleteStaff,
  deleteGeneralEntry,
  upload,
}= require("../controllers/staffController.js");

const router = express.Router();

router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post("/", upload, createStaff);
router.put("/:id", updateStaff);
router.put("/:id/category/:categoryName", updateStaffCategory);
router.delete("/:id", deleteStaff);
router.delete("/:id/elimination/:entryId", deleteEliminationEntry);
router.delete("/:id/mobility/:entryId", deleteMobilityEntry);
router.delete("/:id/general/:entryId", deleteGeneralEntry);



module.exports = router;
