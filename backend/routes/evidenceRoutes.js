const express = require("express");
const router = express.Router();
const { getEvidence, getEvidenceById, uploadEvidence } = require("../controllers/evidenceController");

router.get("/", getEvidence);
router.post("/", uploadEvidence);
router.get("/:id", getEvidenceById);

module.exports = router;
