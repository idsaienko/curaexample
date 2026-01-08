const express = require("express");
const { analyzeNoteWithLLM } = require("../controllers/llmController");

const router = express.Router();

// POST /api/llm/analyze
router.post("/analyze", analyzeNoteWithLLM);

module.exports = router;
